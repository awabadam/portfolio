// Public contact endpoints shared by CTAs across the site.

/** Cal.com booking page for the 15-minute intro call. */
export const CAL_BOOKING_URL = "https://cal.com/awab-adam-ljhood/15min";

/** Same page in Cal.com's embed mode (no Cal chrome), for the inline iframe. */
export function calEmbedUrl(theme: "light" | "dark" = "light") {
  return `${CAL_BOOKING_URL}?embed=true&theme=${theme}&layout=month_view`;
}
