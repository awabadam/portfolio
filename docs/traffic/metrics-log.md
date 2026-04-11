# Metrics Log

Weekly numbers tracked by hand every Friday. Monthly review on the last Friday. Hard kill/scale review at day 90.

## Baseline (pre-launch — 2026-04-11)

Captured before traffic engine v1 starts, for delta measurement.

| Metric | Baseline value | Source |
|---|---|---|
| LinkedIn followers | ? | manual count on profile |
| Twitter/X followers | ? | manual count on profile |
| Instagram followers | ? | manual count on profile |
| TikTok followers | ? | manual count on profile |
| GSC impressions (28d) | 178 | `docs/gsc-baseline-2026-04.md` |
| GSC clicks (28d) | 1 | `docs/gsc-baseline-2026-04.md` |
| `/pricing` traffic from social | 0 | GA4 |
| `/contact` submissions from social | 0 | manual + GA4 |
| Paid clients from social/outbound | 0 | manual |

**Action:** On week 1 Friday, fill in the `?` values by checking each profile once.

---

## Weekly log

Append one row per week. Format `YYYY-WW` for the week column (ISO week number).

| Week | LI followers | LI avg impressions | X followers | IG followers | TikTok avg views | DMs 'AUDIT' | Audits sent | Outbound sent | Outbound replies | /pricing social traffic | /contact submissions | Paid clients |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 2026-15 | | | | | | | | | | | | |
| 2026-16 | | | | | | | | | | | | |

**Week 4 targets (from spec):** LI +20 followers, LI avg 500 impressions, 1 DM/wk, 1 audit/wk, 8 outbound/wk, 10 /pricing hits from social, 0 paid clients (leading indicator).

**Week 12 targets:** LI +150 followers, LI avg 2000 impressions, 5 DMs/wk, 3 audits/wk, 8 outbound/wk, 80 /pricing hits from social, 1 paid client.

---

## Monthly review — last Friday of month

Copy this template each month:

### 2026-MM monthly review

- **Followers delta (all platforms):**
- **Best-performing post:** [title / URL / metrics]
- **Best-performing pillar this month:** T / B / C
- **Worst-performing pillar:** T / B / C
- **DMs received:**
- **Audits delivered:**
- **Paid clients sourced:**
- **Outbound reply rate:** X% (replies / sends)
- **Qualitative notes:**
- **Action for next month:** [tweak one thing — pillar mix, cadence, cta, channel]

---

## 90-day hard review

**Scheduled:** approximately 2026-07-10 (day 90 from 2026-04-11)

### Kill criteria (from spec)

Run this against the metrics above:

- [ ] **TikTok:** avg views ≥ 300 AND ≥1 DM attributed? If no → kill TikTok, reclaim 20min/wk
- [ ] **Pillars:** is any pillar's engagement < 50% of the best pillar's engagement over the past 4 weeks? If yes → kill that pillar, redistribute to top 2
- [ ] **Broad-SMB outbound:** ≥1 paid client from SMB outbound? If no → kill SMB outbound, keep clinic outbound
- [ ] **Channel double-down:** which single channel produced >60% of inbound DMs? → increase cadence there by 50%

### 90-day success criteria (from spec)

- [ ] 3+ paid clients sourced from social or outbound
- [ ] LinkedIn followers 400+
- [ ] ≥1 post broke 5000 impressions
- [ ] `/pricing` traffic from social > 300/mo
- [ ] 2+ net new Google reviews
- [ ] 1+ Clutch review

### 90-day escalation triggers

- [ ] Zero paid clients → rethink offer/positioning, not channels
- [ ] Plenty of views, zero DMs → CTA problem
- [ ] DMs but no conversions → audit quality or pricing objection
