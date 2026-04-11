# Outbound Log

Every outbound touch gets one row. Log on send. Update the `Response` and `Outcome` columns as they come in.

## Source list

User-maintained Google Sheet (update link below when created):

**Source sheet link:** _TBD — create a Google Sheet named "Awab traffic — outbound source list" with two tabs: "clinics" and "smbs". Columns: Business name, Location, Contact name, Channel (LinkedIn / email / IG DM), URL, Qualified (Y/N), Notes._

## Weekly target

- 5 clinic touches (priority)
- 3 broad SMB touches (fallback)
- **Total: 8 per week**

## Log

| Date | Target type | Business | Contact | Channel | Template | Response | Outcome | Notes |
|---|---|---|---|---|---|---|---|---|
| YYYY-MM-DD | clinic | _example Clinic_ | Dr. _ | LinkedIn DM | clinic-1 | — | pending | _PageSpeed LCP 8.4s_ |

**Template column values:** `clinic-1` (LinkedIn DM), `clinic-2` (cold email), `smb-1` (audit-led email).

**Response column values:** `—` (no reply yet), `replied` (any reply), `bounced` (email bounced), `unsub` (asked to stop).

**Outcome column values:** `pending`, `audit-sent`, `call-booked`, `paid-client`, `no-reply`, `not-interested`, `declined`.

## Weekly summary

Append a row each Friday:

| Week | Clinic touches | SMB touches | Replies | Audits sent | Paid clients |
|---|---|---|---|---|---|
| YYYY-WW | 5 | 3 | 0 | 0 | 0 |

## Rules

- Log the touch **on send**, not later
- One follow-up max per contact (see outbound-templates.md)
- If a target is `paid-client`, move the row to the Success Cases section below AND note the revenue

## Success Cases

*(Move rows here when a target becomes a paid client. Include revenue for ROI tracking.)*
