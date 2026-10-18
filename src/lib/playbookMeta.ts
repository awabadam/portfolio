/**
 * Client-safe facts about the playbook (no content import). The counts are
 * identical in every locale; scripts/check-playbook.mjs enforces the shape.
 */

export const PLAYBOOK_META = {
  chapters: 10,
  templates: 17,
  quickWins: 10,
} as const;

/** localStorage key for the access key returned by POST /api/audit. */
export const PLAYBOOK_KEY_STORAGE = "clinic-playbook-key";

/** localStorage key for the checklist state on /audit/playbook. */
export const PLAYBOOK_CHECKLIST_STORAGE = "clinic-playbook-checklist-v1";

export function playbookHref(key: string | null | undefined): string {
  return key ? `/audit/playbook?k=${encodeURIComponent(key)}` : "/audit/playbook";
}
