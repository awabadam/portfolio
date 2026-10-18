/**
 * Prints an HTML file to PDF with headless Firefox over WebDriver BiDi.
 * Waits for Paged.js to finish (window.__pagedDone) before printing.
 */
import { spawn } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

const FIREFOX = process.env.FIREFOX_BIN || "/etc/profiles/per-user/awab/bin/firefox";
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

interface BidiMessage {
  id?: number;
  type?: string;
  result?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  error?: string;
  message?: string;
}

export async function printToPdf(opts: { html: string; pdf: string; profileDir: string; port?: number; timeoutMs?: number }) {
  const port = opts.port ?? 9571;
  rmSync(opts.profileDir, { recursive: true, force: true });
  mkdirSync(opts.profileDir, { recursive: true });
  const proc = spawn(
    FIREFOX,
    ["--headless", "--no-remote", "--profile", opts.profileDir, `--remote-debugging-port=${port}`, "--window-size=1200,1600", "about:blank"],
    { stdio: "ignore" },
  );
  let sock: WebSocket | undefined;
  try {
    for (let i = 0; i < 100 && !sock; i++) {
      try {
        const s = new WebSocket(`ws://127.0.0.1:${port}/session`);
        await new Promise((res, rej) => {
          s.onopen = res;
          s.onerror = rej;
        });
        sock = s;
      } catch {
        await sleep(300);
      }
    }
    if (!sock) throw new Error(`Firefox BiDi did not open on port ${port}`);
    const ws = sock;
    let id = 0;
    const pending = new Map<number, (m: BidiMessage) => void>();
    ws.onmessage = (e) => {
      const m = JSON.parse(String(e.data)) as BidiMessage;
      if (m.id && pending.has(m.id)) {
        pending.get(m.id)!(m);
        pending.delete(m.id);
      }
    };
    const send = (method: string, params: object = {}) =>
      new Promise<BidiMessage>((r) => {
        const i = ++id;
        pending.set(i, r);
        ws.send(JSON.stringify({ id: i, method, params }));
      });
    const check = (m: BidiMessage, what: string) => {
      if (m.type === "error") throw new Error(`${what}: ${m.error} ${m.message ?? ""}`);
      return m;
    };

    check(await send("session.new", { capabilities: {} }), "session.new");
    const tree = check(await send("browsingContext.getTree", {}), "getTree");
    const context = tree.result.contexts[0].context as string;
    const evalJs = async (expression: string) =>
      (await send("script.evaluate", { expression, target: { context }, awaitPromise: true })).result?.result?.value;

    await send("browsingContext.setViewport", { context, viewport: { width: 1200, height: 1600 } });
    check(await send("browsingContext.navigate", { context, url: pathToFileURL(opts.html).href, wait: "complete" }), "navigate");

    const deadline = Date.now() + (opts.timeoutMs ?? 180_000);
    let pages: number | undefined;
    while (Date.now() < deadline) {
      pages = await evalJs("window.__pagedDone || 0");
      if (pages) break;
      await sleep(500);
    }
    if (!pages) throw new Error("Paged.js did not finish in time");
    await evalJs("document.fonts.ready.then(() => 'ok')");
    await sleep(800);
    const report = await evalJs(`JSON.stringify(window.__pagedReport || {})`);

    const printed = check(
      await send("browsingContext.print", {
        context,
        background: true,
        margin: { top: 0, bottom: 0, left: 0, right: 0 },
        page: { width: 21.0, height: 29.7 },
        orientation: "portrait",
        shrinkToFit: false,
      }),
      "print",
    );
    writeFileSync(opts.pdf, Buffer.from(printed.result.data, "base64"));
    ws.close();
    return { pages, report: JSON.parse(report || "{}") as Record<string, unknown> };
  } finally {
    proc.kill();
    await sleep(500);
    rmSync(opts.profileDir, { recursive: true, force: true });
  }
}
