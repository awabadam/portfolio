# Email Setup

All site email goes through [Resend](https://resend.com) via `src/lib/email.ts`
(plain `fetch` to the HTTP API, no SDK). Every route calls `sendEmail()`, which
never throws: it returns `{ sent, error }` so a failed send never loses a lead.

## Environment variables

| Variable          | Purpose                                                    |
| ----------------- | ---------------------------------------------------------- |
| `RESEND_API_KEY`  | Resend API key. A send-only key is enough.                 |
| `RECIPIENT_EMAIL` | Where admin alerts go (new leads, audits, blog drafts).    |

Email counts as configured only when both are set (`isEmailConfigured()`).
Set them in `.env.local` and in Vercel (Production + Preview).
`GET /api/test-env` reports whether they are present.

## Senders

Both addresses are Google Workspace aliases of `admin@awab.design`, so replies
land in one inbox. Pick one with `sendEmail({ from: "hello" | "audit", ... })`.

| Sender               | Used for                                                  |
| -------------------- | --------------------------------------------------------- |
| `hello@awab.design`  | Default. Contact form, newsletter, blog-draft alert. Also the public address on the site. |
| `audit@awab.design`  | Clinic audit report, playbook access, template pack.      |

## DNS (awab.design)

- MX: Google Workspace (`smtp.google.com`)
- SPF on the root: `include:_spf.google.com`
- DKIM: `google._domainkey` (Workspace) and `resend._domainkey` (Resend)
- `send.awab.design`: Resend bounce/return-path subdomain (MX + SPF)
- DMARC: `p=none` for now; move to `p=quarantine` after a few clean weeks

Resend mail passes DMARC through its DKIM signature on `awab.design`, so the
root SPF does not need a Resend include.

## Testing

Send a one-off test with the API key from `.env.local`:

```bash
set -a; . ./.env.local; set +a
curl -s -X POST https://api.resend.com/emails \
  -H "Authorization: Bearer $RESEND_API_KEY" -H "Content-Type: application/json" \
  -d '{"from":"Awab Elkhalil <hello@awab.design>","to":["admin@awab.design"],"subject":"Test","text":"Test"}'
```

A response with an `id` means Resend accepted it; check the inbox (and spam)
to confirm delivery. A send-only key cannot read delivery status, so use the
Resend dashboard for that.

## Gmail settings

- Add `hello@` and `audit@` under Settings → Accounts → "Send mail as", and
  choose "Reply from the same address the message was sent to".
- Filter on `deliveredto:audit@awab.design` to label audit leads.
