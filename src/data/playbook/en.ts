import type { Playbook } from "./types";

/**
 * English edition (source). AR, FR and TR are rewrites of this file with the
 * same ids and item counts. Keep chapters standalone: a reader who opens only
 * the chapter for their weakest answer must be able to finish it.
 *
 * Style: plain English for busy, often non-native readers. Short sentences,
 * one idea each, "you" voice. Explain a technical term the first time a
 * chapter uses it.
 */
export const PLAYBOOK: Playbook = {
  title: "The 30-Day International Patient Website Playbook",
  subtitle: "Simple fixes that bring more patients from abroad. Templates included.",
  intro:
    "Your audit shows where you lose patients. This playbook fixes it. Each of the 10 chapters matches one audit question, with a checklist and templates. Start with your three lowest answers. No new website needed.",
  chapters: [
    {
      id: "languages",
      title: "Full pages in the languages your patients speak",
      promise: "You will know which pages to translate first, and how to brief a translator.",
      minutes: 4,
      why: [
        "Patients compare clinics on a phone, in their own language. If your pages are in English, they pick another clinic.",
        "An Arabic ad that opens an English page wastes the click.",
        "The fix is small: two or three languages, key pages only.",
      ],
      steps: [
        {
          title: "Pick two or three markets, not ten",
          body: "Count the countries in six months of inquiries. Pick the two or three top languages. Each one adds pages to maintain.",
        },
        {
          title: "List the pages that bring inquiries",
          body: "Each language needs treatments, doctors, the journey page, prices, FAQ, contact and thank-you. The blog can wait. A home page alone is not enough.",
        },
        {
          title: "Have pages written, not translated",
          body: "Give a native medical writer the English page and the brief below. Machine translation can draft. A native speaker must finish.",
        },
        {
          title: "Match the layout to the language",
          body: "Arabic reads right to left, so the menu, icons, forms and buttons must flip too. French and German are longer, so leave room in buttons.",
        },
        {
          title: "Make the language switch easy to find",
          body: "Put it in the header, visible on a phone. Write each language in its own script: العربية, Français, Türkçe. Suggest a language, never force one.",
        },
        {
          title: "Keep all languages in sync",
          body: "Give each language its own URL, title and hreflang tags (code that tells Google the page language). Change prices and doctors in all languages the same day.",
        },
      ],
      checklist: [
        "Two or three languages, chosen from real inquiries",
        "Every treatment page in each language",
        "Doctors, journey, prices, FAQ and contact in each language",
        "Written or checked by a native medical writer",
        "Arabic fully right to left, forms and buttons too",
        "Language switch visible on a phone",
        "Own URL, title and hreflang per language",
        "One person keeps all languages in sync",
      ],
      templates: [
        {
          id: "translation-brief",
          title: "Translation brief for one market",
          kind: "outline",
          note: "Fill in one per language. Send it with the English pages.",
          body: `Market: (e.g. Gulf, France, UK)
Language: (e.g. Arabic with Gulf expressions; European French)
Reader: (e.g. patient aged 35 to 55, comparing clinics on a phone; often a relative books)
Treatment names: (the everyday words patients use)
Tone: plain, calm, confident. No exclamation marks. No "best clinic".
Prices: (EUR / GBP / USD; same from-price as the English page)
Top questions: (3 to 5 from your WhatsApp chats)
Do not say: (unproven claims, promised results, competitor names)
Pages, in order: treatments, doctors, journey, prices, FAQ, contact, thank-you
Format: one document per page, same headings
Deadline and approver: (name, date)`,
        },
      ],
      mistakes: [
        "Only the home page translated",
        "A plugin that breaks Arabic layout",
        "Language switch hidden in a menu",
        "A price changed in one language only",
      ],
      done: "A patient goes from your ad to WhatsApp without seeing English.",
    },
    {
      id: "journey",
      title: "One page that explains the whole trip",
      promise: "One page answers travel questions before patients ask.",
      minutes: 4,
      why: [
        "Patients rarely doubt the treatment. They worry about the trip: pickup, hotel, days, aftercare.",
        "Your team answers these questions on WhatsApp every day. One page saves that time.",
        "Then a reply is short: 'See this page. Here is your plan.'",
      ],
      steps: [
        {
          title: "Collect the real questions",
          body: "Ask coordinators for the ten travel questions they hear most. Use the patients' words as headings.",
        },
        {
          title: "Follow the patient's order",
          body: "Inquiry, plan, travel, stay, treatment days, aftercare, follow-up from home. For each, say what happens, how long, and who does what.",
        },
        {
          title: "Name the practical details",
          body: "Name the airports, pickup, hotel and distance. Say if a companion stays free. Give days, fly-home day and payment methods.",
        },
        {
          title: "Name a person for each stage",
          body: "Show a named coordinator with photo and languages. Name an aftercare contact with hours. Patients fear being forgotten after paying.",
        },
        {
          title: "Add a summary to treatment pages",
          body: "Add three lines: days in Istanbul, fly-home day, what is included. Link to the full page.",
        },
        {
          title: "Use it in replies",
          body: "Save the link as a WhatsApp quick reply. The page explains. The coordinator books.",
        },
      ],
      checklist: [
        "Journey page in every language",
        "Seven stages, from first message to home",
        "Airports, pickup and hotel named",
        "Days and fly-home day per treatment",
        "Companion rules and payment methods",
        "Named coordinator and aftercare contact",
        "Short summary on every treatment page",
        "Link saved as a quick reply",
      ],
      templates: [
        {
          id: "journey-page",
          title: "Patient journey page outline with sample sentences",
          kind: "outline",
          note: "Replace the [brackets] with your real details.",
          body: `Title: Your treatment in Istanbul, step by step

1. Your inquiry (day 0)
"Message us on WhatsApp or the form. A coordinator who speaks [English, Arabic, French] replies within [2 hours] and asks for photos."

2. Your plan (days 1 to 3)
"Our doctor checks your case. You get a written plan: treatment, days, total price, inclusions. Nothing changes unless you agree."

3. Travel
"You book flights to [Istanbul Airport (IST) or Sabiha Gökçen (SAW)]. We meet you at arrivals and drive you to the hotel."

4. Your stay
"You stay at a [4-star] hotel, [10 minutes] from the clinic. [A companion stays free.] All transfers are included."

5. Treatment days
"[Implants: 2 visits of 5 to 7 days, 3 to 6 months apart.] A coordinator joins every appointment."

6. Aftercare in Istanbul
"You see the doctor before you fly. You get instructions in your language and your coordinator's number."

7. Follow-up from home
"We check in after [1 week, 1 month, 6 months]. Message [name] any time; we reply within [one working day]."

Closing line
"Still have a question? Message us in your language." [WhatsApp button]`,
        },
      ],
      mistakes: [
        "A sales pitch instead of a schedule",
        "'It depends' instead of a range of days",
        "No named aftercare contact",
        "The page hidden in the footer",
      ],
      done: "A coordinator answers any travel question with one link and two sentences.",
    },
    {
      id: "whatsapp",
      title: "A WhatsApp button on every treatment page",
      promise: "Every treatment page opens a ready WhatsApp chat, and your team has scripts.",
      minutes: 5,
      why: [
        "Most patients abroad use WhatsApp, not forms. If the button is hard to find, they leave.",
        "Patients often choose the clinic that answers first, with good questions.",
        "This is often your biggest win, and it takes one afternoon.",
      ],
      steps: [
        {
          title: "Use a clinic-owned Business number",
          body: "Not a coordinator's own phone. Add your name, address, website and languages. Set business hours and an away message.",
        },
        {
          title: "Build one link per treatment",
          body: "Use https://wa.me/<number>?text=<message>, with the number in international format, no plus or spaces. In the message, a space is %20 and a new line is %0A.",
        },
        {
          title: "Place the button within thumb reach",
          body: "On phones, fix it to the bottom of the screen. On computers, put it in the header and after the prices. Use words, not only an icon.",
        },
        {
          title: "Write the first reply in advance",
          body: "Greet them in their language. Ask three things: which treatment, when they can travel, and a photo. Save it as a quick reply.",
        },
        {
          title: "Set a reply time you can keep",
          body: "For example: 15 minutes in working hours, 09:00 for night messages. Write it on the page, then keep it.",
        },
        {
          title: "Track the clicks",
          body: "Record each click with its page and treatment (chapter 9). Then you know which page or ad brought the chat.",
        },
      ],
      checklist: [
        "WhatsApp Business on a clinic number",
        "Button on every treatment page, fixed on phones",
        "Ready-made message names the treatment",
        "Away message in each language",
        "First-reply script saved per language",
        "Reply time shown and checked weekly",
        "Button has words, not only an icon",
        "Each click is tracked",
      ],
      templates: [
        {
          id: "wa-prefilled",
          title: "Pre-filled WhatsApp messages per treatment",
          kind: "message",
          note: "One per treatment page. In the link, a space is %20.",
          body: `Dental implants (EN):
Hello, I am reading your dental implants page and would like a quote. My country: ___

Veneers / smile design (EN):
Hello, I am interested in veneers. Can I send photos for a plan? My country: ___

Hair transplant (EN):
Hello, I would like a hair transplant assessment. I can send photos. My country: ___

Rhinoplasty (EN):
Hello, I am thinking about rhinoplasty and would like a consultation. My country: ___

Any other treatment (EN):
Hello, I have a question about [treatment]. My country: ___

Example link:
https://wa.me/90XXXXXXXXXX?text=Hello%2C%20I%20am%20reading%20your%20dental%20implants%20page%20and%20would%20like%20a%20quote.%20My%20country%3A%20`,
        },
        {
          id: "wa-first-reply",
          title: "First-reply scripts for the clinic team",
          kind: "message",
          note: "Save as quick replies. Send within minutes. Ask all three questions at once.",
          body: `First reply (EN):
Hello [name], thank you for writing to [Clinic]. I am [coordinator] and I will look after you. To prepare your plan, please tell me:
1. Which treatment you want, and what bothers you most
2. Roughly when you could travel
3. A photo (or X-ray), so the doctor can check
Then you get a written plan with the price and days.

If they only ask "price?" (EN):
Of course. [Treatment] starts from [amount], with [hotel, transfers] included. Send a photo and the doctor confirms your price within [24 hours].

Night away message (EN):
Thanks for your message. We reply 09:00 to 20:00 Istanbul time. [Coordinator] will write in the morning. Please send a photo and your country.

Follow-up after 2 days (EN):
Hello [name], did you get the plan? Any questions about price, days or hotel?`,
        },
      ],
      mistakes: [
        "Button only on the contact page",
        "A personal number that leaves with the coordinator",
        "First reply 'How can we help?' with no questions",
        "No away message for night messages",
      ],
      done: "One tap opens a chat naming the treatment, and a test gets a fast scripted reply.",
    },
    {
      id: "speed",
      title: "Pages that load in under 3 seconds on a phone",
      promise: "Your treatment pages pass a phone speed test and stay fast.",
      minutes: 4,
      why: [
        "Patients often come from an ad, on mobile data. If the page is slow, they leave, and you still pay for the click.",
        "Google ranks slow pages lower and charges more for them in Ads.",
        "Usual causes: big images, video, sliders, extra scripts. All are fixable without a redesign.",
      ],
      steps: [
        {
          title: "Test treatment pages, not the home page",
          body: "Test three treatment pages per language in Google PageSpeed Insights (mobile). Aim for LCP (main content shows) 2.5 s or less, INP (tap response) 200 ms or less, CLS (page jumps) 0.1 or less.",
        },
        {
          title: "Shrink every image",
          body: "Save photos as WebP, at display size, under about 200 KB. Give each image a width and height so the page does not jump.",
        },
        {
          title: "Remove video and sliders",
          body: "Use one strong photo instead of a background video. Replace sliders with your best single image.",
        },
        {
          title: "Cut scripts you do not use",
          body: "List every outside script: chat widgets, old pixels, extra fonts. Keep your analytics, your ad pixel and one chat tool. Remove the rest.",
        },
        {
          title: "Use caching and a CDN",
          body: "Ask your developer for caching, compression and a CDN (servers near the patient). It is usually just a setting.",
        },
        {
          title: "Test on a real phone",
          body: "Use a mid-range Android on 4G. WhatsApp should be tappable within three seconds. Test again after each content change.",
        },
      ],
      checklist: [
        "Three pages per language tested, scores logged",
        "LCP 2.5 s or less, INP 200 ms or less, CLS 0.1 or less",
        "Images WebP, right size, under 200 KB",
        "No video or sliders on treatment pages",
        "Unused scripts removed",
        "Caching, compression and CDN on",
        "Checked on a real phone, mobile data",
        "Monthly re-test with an owner",
      ],
      templates: [
        {
          id: "speed-log",
          title: "Monthly speed log",
          kind: "table",
          note: "One row per page per month. If a score drops, check the last change.",
          body: `| Date | Page (URL) | Language | LCP (s) | INP (ms) | CLS | Page weight (MB) | What changed since last month | Owner |
|---|---|---|---|---|---|---|---|---|
| 2026-01-05 | /en/dental-implants | EN | 2.1 | 140 | 0.03 | 1.2 | Hero video removed | Developer |
| 2026-01-05 | /ar/dental-implants | AR | 2.4 | 150 | 0.05 | 1.3 | Images changed to WebP | Developer |`,
        },
      ],
      mistakes: [
        "Testing only the home page, on office Wi-Fi",
        "Full-size photos straight from the camera",
        "Keeping a video because it 'looks premium'",
        "Adding a second chat widget",
      ],
      done: "Treatment pages score green on mobile, and WhatsApp works within three seconds.",
    },
    {
      id: "treatments",
      title: "Treatment pages that answer price and recovery",
      promise: "Each treatment gets a page with price, inclusions, days and fly-home day.",
      minutes: 5,
      why: [
        "Every patient wants the price and recovery time. Hide them and patients ask a clinic that shows them.",
        "Clear pages bring fewer price shoppers. Your coordinators book instead of quoting all day.",
        "A from-price with inclusions looks professional. A very low price looks risky.",
      ],
      steps: [
        {
          title: "One page per treatment",
          body: "Not one 'Services' page. Each treatment gets its own page and URL. Each should work alone as an ad landing page.",
        },
        {
          title: "Use one structure",
          body: "What it is, how you do it, days and visits, fly-home day, price and inclusions, materials, doctors, results, FAQ, WhatsApp. See the outline below.",
        },
        {
          title: "Show a from-price and inclusions",
          body: "Use an honest price for a simple case. List what is and is not included. Name the brands you really use.",
        },
        {
          title: "State days and recovery",
          body: "Give days, visits, fly-home day and back-to-work day. Describe the first week home. A range is fine. Vague is not.",
        },
        {
          title: "Answer the five real questions",
          body: "Answer the five questions you hear most, honestly. Include the hard ones: pain, failure, problems at home.",
        },
        {
          title: "Finish with one action",
          body: "End with the WhatsApp button for this treatment and a short form. Nothing else.",
        },
      ],
      checklist: [
        "Own page and URL per treatment, every language",
        "From-price with what is and is not included",
        "Materials and brands named",
        "Days, visits and fly-home day",
        "First week at home described",
        "Five honest FAQ",
        "Doctors linked by name",
        "WhatsApp button and form at the end",
      ],
      templates: [
        {
          id: "treatment-page",
          title: "Treatment page outline with sample copy (dental implants)",
          kind: "outline",
          note: "Use your own numbers. Works for any treatment. Keep the order.",
          body: `H1: Dental implants in Istanbul

Intro
"Titanium implants by [Dr. Name], [number] implants in [years] years. Two visits. A written plan before you travel."

What it is and who it is for
"A titanium post in the jaw that holds a crown, bridge or full arch. You need enough bone, or a bone graft first. Not for untreated gum disease or uncontrolled diabetes."

How we do it
"Visit 1 (5 to 7 days): scan, implants, temporary teeth. Visit 2 (3 to 6 months later, 5 to 7 days): final crowns or bridge."

Days and flying home
"You can fly 48 hours after the implants. Most patients return to desk work the next day at home."

Price from
"From [amount] per implant. From [amount] for a full arch (All-on-4)."
Included: 3D scan, implant ([brand]), temporary teeth, crowns ([material]), [n] hotel nights per visit, transfers, medicine, follow-up.
Not included: flights, bone graft ([amount]), extra nights.

Materials
"[Implant brand, country], [crown material]. Warranty: [terms]."

Your doctor
"[Dr. Name], [qualification], [years] years of implant surgery, member of [association]." [profile link]

Results
[3 to 6 before-and-after cases, same angle, with age range, treatment and days]

FAQ
- Does it hurt? "Local anaesthesia. Usually 2 to 3 days of discomfort, eased by medicine."
- What if an implant fails? "[Your real policy: what is covered, what the patient pays.]"
- Can my home dentist do follow-up? "Yes. You get your full file."
- One visit possible? "Sometimes. The doctor decides after the scan."
- How do I pay? "[Methods]. [Deposit] to confirm, the rest at the first visit."

Closing
"Send a photo or X-ray. Get your plan in [24 hours]." [WhatsApp button] [short form]`,
        },
        {
          id: "price-table",
          title: "Price range table",
          kind: "table",
          note: "From-prices only. The written plan gives the exact price.",
          body: `| Treatment | Price from | Typical range | Days in Istanbul | Visits | Included | Not included |
|---|---|---|---|---|---|---|
| Single dental implant | [amount] | [range] | 5 to 7 per visit | 2 | Scan, implant, crown, [n] hotel nights, transfers | Flights, bone graft |
| All-on-4 (per jaw) | [amount] | [range] | 5 to 7 per visit | 2 | Scan, 4 implants, temporary and final bridge, hotel, transfers | Flights, extra extractions |
| Veneers (per tooth) | [amount] | [range] | 5 to 7 | 1 | Smile design, veneers ([material]), hotel, transfers | Flights, whitening |
| Hair transplant (FUE) | [amount] | [range] | 3 | 1 | Grafts up to [n], medicine, hotel, transfers | Flights, PRP |
| Rhinoplasty | [amount] | [range] | 7 | 1 | Surgery, 1 hospital night, hotel, transfers | Flights, revision surgery |`,
        },
      ],
      mistakes: [
        "One 'Our services' page with no prices or days",
        "'Contact us for price' on every page",
        "A from-price no real case gets",
        "'Premium' materials with no brand named",
      ],
      done: "Patients ask about dates, not 'how much?'.",
    },
    {
      id: "credentials",
      title: "Credentials a patient can check",
      promise: "Every doctor gets a profile patients can check.",
      minutes: 3,
      why: [
        "Patients must trust you before they write. Real names and facts build trust.",
        "Many patients search the doctor's name. If they find nothing, they leave.",
        "It costs one photo session and one hour per doctor.",
      ],
      steps: [
        {
          title: "One profile page per doctor",
          body: "Use the registered name and a real photo from the clinic. Add specialty, years and treatments. Link profiles and treatment pages both ways.",
        },
        {
          title: "List what can be verified",
          body: "University, training, registration number, memberships, rough number of procedures. A patient should be able to check each one.",
        },
        {
          title: "Show accreditations where they matter",
          body: "Show them on the about page and each treatment page, linked to the issuer. If you hold Turkey's health tourism authorisation, show it.",
        },
        {
          title: "Remove what cannot be proven",
          body: "Replace 'best clinic' and 'world-class' with facts: years, numbers, names. Slogans create doubt.",
        },
        {
          title: "Show the people patients meet",
          body: "Show coordinators with names, photos and languages. They are the first contact.",
        },
        {
          title: "Keep it current",
          body: "When staff change, update every language that week. An old profile invites complaints.",
        },
      ],
      checklist: [
        "Profile per doctor, real clinic photo",
        "Degrees, registration and memberships listed",
        "Rough number of procedures",
        "Profiles and treatment pages linked",
        "Accreditations linked to the issuer",
        "No 'best' or 'world-class' claims",
        "Coordinators shown with names and languages",
        "Profiles updated when staff change",
      ],
      templates: [
        {
          id: "doctor-profile",
          title: "Doctor profile template",
          kind: "text",
          note: "One per doctor. Only facts a patient can check.",
          body: `Name: Dr. [First Last], [DDS / MD / specialist title]
Role: [e.g. Implant surgeon, head of implant team]
Languages: [Turkish, English; Arabic with a coordinator]
Years in practice: [n]
Procedures: [e.g. about n implants per year]

Education and training
- [University], [degree], [year]
- [Specialty training], [institution], [year]
- [Advanced course], [institution], [year]

Registration and memberships
- [Professional chamber], no. [number]
- [Association], member since [year]

Treatments done here
- [Treatment 1] [link]
- [Treatment 2] [link]

In their words (2 to 3 sentences)
"[How they plan a case; what they refuse to do.]"

Patient feedback
[2 short linked quotes: first name, country, treatment]

[WhatsApp button: Ask Dr. [Last] a question]`,
        },
      ],
      mistakes: [
        "Stock photos of models",
        "'Our expert team' with no names",
        "Footer logos with no link",
        "A profile for a doctor who left",
      ],
      done: "Each doctor's facts check out online.",
    },
    {
      id: "gallery",
      title: "Before-and-after results with consent",
      promise: "You get a consistent gallery, with signed consent for each case.",
      minutes: 3,
      why: [
        "Results are your best proof. Without them, patients compare on price.",
        "Without written consent, one complaint can take down the whole gallery.",
        "The rules: same angle, same light, short caption, written consent.",
      ],
      steps: [
        {
          title: "Set a standard shot",
          body: "Teeth: front smile, same distance and light. Hair: front, top, both sides. Face: front and side, no makeup. Put the rules on a card in the room.",
        },
        {
          title: "Take the before photo every time",
          body: "Take it at the first visit, before treatment. Take the after photo at the final check, and again when healed.",
        },
        {
          title: "Get written consent",
          body: "One page: what you show, where, how long, and that they can withdraw. Keep it in the file. This is not legal advice, so ask your lawyer.",
        },
        {
          title: "Caption with three facts",
          body: "Age range, treatment, days. No names. For example: '40s, All-on-4, 2 visits of 6 days.'",
        },
        {
          title: "Show cases on treatment pages",
          body: "Show three to six cases on each treatment page, where patients decide. Before and after side by side, same size.",
        },
        {
          title: "Be honest about limits",
          body: "Add one line: results vary. If a face is hidden, say the patient asked.",
        },
      ],
      checklist: [
        "Standard shot card in each room",
        "Before photo for every patient",
        "After photo at final check and follow-up",
        "Signed consent kept in the file",
        "Caption: age range, treatment, days",
        "Three to six cases per treatment page",
        "Hidden faces labelled as patient request",
        "'Results vary' line under the gallery",
      ],
      templates: [
        {
          id: "consent-checklist",
          title: "Before-and-after consent checklist (not legal advice)",
          kind: "text",
          note: "A starting point for your lawyer. Laws differ by country.",
          body: `Before the photo
- Photos are for the medical file. Publishing is a separate choice
- Standard angles. No jewellery or tattoos unless they agree

The form should say
- Clinic name and patient's full name
- What you publish: photos of [area], face shown / eyes covered / face cropped
- Where: website, named social accounts, print
- How long. They can withdraw any time; you remove images within [n] days
- No name or personal detail without separate agreement
- Whether they get anything in return
- Date, signature, a copy in their language

Storage
- Form in the patient file, linked to photos by case number
- A sheet of published cases: case, treatment, where, consent date, withdrawal date

Before publishing
- Form signed and matches what you publish
- Caption has no name or exact age
- After photo shows a healed result

Ask your lawyer about
- Data law in the patient's country too
- Minors and patients who cannot consent
- Your professional body's advertising rules`,
        },
      ],
      mistakes: [
        "Different angle or light, which looks fake",
        "Only verbal consent",
        "No captions",
        "After photos taken before swelling goes down",
      ],
      done: "Each treatment page shows three captioned cases, each with consent on file.",
    },
    {
      id: "booking",
      title: "A clear path from interest to a booked consultation",
      promise: "Patients request a consultation in under a minute and know what happens next.",
      minutes: 3,
      why: [
        "Some patients prefer a form, especially in Europe. Without one, they wait.",
        "A long form or silent thank-you page loses people. Unsure it worked, they write elsewhere.",
        "The fix: a short form, a useful thank-you page, a fast confirmation.",
      ],
      steps: [
        {
          title: "Ask for five things, not fifteen",
          body: "Name, country, WhatsApp, treatment, travel month. Ask the rest later. A photo upload can be optional.",
        },
        {
          title: "Place the form where patients decide",
          body: "Put it at the end of every treatment page, next to WhatsApp. Also link a consultation page from the header.",
        },
        {
          title: "Make the thank-you page useful",
          body: "Say who replies and when. Link to the journey page and the doctor. Count conversions on this page.",
        },
        {
          title: "Confirm within minutes",
          body: "Send an email, and a WhatsApp if you can, in their language. Name the coordinator and ask the three questions.",
        },
        {
          title: "Give each lead an owner",
          body: "Send each lead to the coordinator for that language, with a backup. Log it in the tracker (chapter 9).",
        },
        {
          title: "Offer a time, not 'we will call'",
          body: "Offer two video call times in the first reply. A set time makes an appointment.",
        },
      ],
      checklist: [
        "Five-field form with treatment and travel month",
        "Form on treatment pages and a consultation page",
        "Works in every language",
        "Thank-you page shows reply time",
        "Automatic confirmation within minutes",
        "Each lead goes to a named coordinator",
        "Video call time offered",
        "Form counted as a conversion",
      ],
      templates: [
        {
          id: "inquiry-form",
          title: "Consultation form fields and thank-you page",
          kind: "text",
          note: "Keep the order. Match the treatment list to your pages.",
          body: `Form title: Get your written plan

Fields
1. Your name (text, required)
2. Country (dropdown, required)
3. WhatsApp or phone, with country code (tel, required)
4. Treatment (dropdown, required): Dental implants / All-on-4 / Veneers / Hair transplant / Rhinoplasty / Other
5. When could you travel? (dropdown, required): Within 1 month / 1 to 3 months / 3 to 6 months / Not sure
6. Photo or X-ray (file, optional, up to 3)
7. Anything the doctor should know (text, optional)
Consent: "I agree that [Clinic] contacts me about my request." (checkbox, required)
Button: Send my request

Hidden fields (chapter 9): page URL, language, utm_source, utm_medium, utm_campaign, gclid

Thank-you page
Heading: Thank you, [name]. [Coordinator] has your request.
Body: "We reply on WhatsApp within [15 minutes, 09:00 to 20:00 Istanbul time]. Your plan follows within [24 hours]."
Links: Your trip [journey page] / Meet [Dr. Name] [profile]
Secondary: "Talk now on WhatsApp." [button]`,
        },
        {
          id: "booking-confirmation",
          title: "Confirmation message after a form submission",
          kind: "message",
          note: "Sent automatically within minutes. A person follows up.",
          body: `WhatsApp (EN):
Hello [name], this is [coordinator] from [Clinic]. I got your request about [treatment]. Please send a photo [or X-ray] and tell me what bothers you most. Your written plan with price and days follows within [24 hours].

Email subject (EN): We received your request, [Clinic]

Email body (EN):
Hello [name],
Thank you for your request about [treatment]. I am [coordinator] and I will look after you.
Next steps:
1. I will message you on WhatsApp at [number] within [time].
2. Our doctor writes your plan: treatment, price, days, inclusions.
3. If you like it, we suggest dates and you book flights.
Your trip explained: [journey link]
Kind regards,
[coordinator], [Clinic]
[WhatsApp number] / [address]`,
        },
      ],
      mistakes: [
        "Twelve required fields",
        "A thank-you page that only says 'Sent'",
        "Leads in an inbox with no owner",
        "Replying the next day",
      ],
      done: "A test request gets a confirmation in minutes and shows in the tracker.",
    },
    {
      id: "tracking",
      title: "Know which page and which ad brought each patient",
      promise: "You will know where each lead came from, and Google Ads will learn from bookings.",
      minutes: 5,
      why: [
        "Without tracking, you guess. You know total spend, but not which ad brought patients.",
        "So you pay for ads that bring chats, and cut ads that bring bookings.",
        "This chapter is technical. But a simple lead sheet already helps.",
      ],
      steps: [
        {
          title: "Install one analytics tool",
          body: "Install Google Analytics 4 (GA4, free visitor statistics) with Google Tag Manager. Put it on every page and make it respect cookie consent. Remove old tags.",
        },
        {
          title: "Count the actions that matter",
          body: "Record WhatsApp clicks, phone clicks and forms as key events in GA4. Add page, language and treatment.",
        },
        {
          title: "Name campaign links the same way",
          body: "Add UTM tags (labels on a link that show its source) to every ad and post. Always use the lowercase pattern below.",
        },
        {
          title: "Keep a lead tracker",
          body: "Keep one row per inquiry, filled in by the coordinator. 'Source' and 'booked' matter most. Review 'status' every Monday.",
        },
        {
          title: "Save the Google click ID",
          body: "With auto-tagging on, Google adds a click ID (gclid) to the link. Save it in a hidden form field. For WhatsApp leads, note page and campaign.",
        },
        {
          title: "Send bookings back to Google Ads",
          body: "Each week, upload bookings as offline conversions (sales that happen off the website). Google then finds patients who book, not just click.",
        },
        {
          title: "Review the numbers weekly",
          body: "Spend 15 minutes each Monday on cost per booked patient, per campaign. Cut what does not book.",
        },
      ],
      checklist: [
        "GA4 via Tag Manager, with cookie consent",
        "WhatsApp, phone and form as key events",
        "Events carry page, language, treatment",
        "One UTM pattern for every link",
        "Lead tracker, one row per inquiry",
        "Auto-tagging on, gclid saved",
        "Weekly booking upload to Google Ads",
        "Weekly 15-minute review",
      ],
      templates: [
        {
          id: "lead-tracker",
          title: "Lead tracker (CSV)",
          kind: "csv",
          note: "Paste into a new sheet. Status: new, replied, plan sent, booked, arrived, lost. Value: plan total.",
          body: `date,name,country,language,source,campaign,treatment,channel,status,booked,value,notes,gclid
2026-01-12,Sara M.,Saudi Arabia,ar,google,ar-dental-implants-search,All-on-4,whatsapp,plan sent,no,,Asked about companion hotel; follow up Thursday,
2026-01-13,Thomas L.,France,fr,meta,fr-hair-transplant-video,Hair transplant FUE,form,booked,yes,2900,Travels 3 March; deposit paid,CjwKCA-example`,
        },
        {
          id: "ga4-events",
          title: "GA4 event checklist",
          kind: "table",
          note: "Create in Tag Manager. Mark key events in GA4 (Admin > Events). Test in preview first.",
          body: `| Event name | Fires when | Parameters | Key event? |
|---|---|---|---|
| whatsapp_click | A wa.me or api.whatsapp.com link is clicked | page_path, language, treatment, button_position | Yes |
| call_click | A tel: link is clicked | page_path, language, treatment | Yes |
| form_submit | Form sent (or thank-you page viewed) | page_path, language, treatment, form_id | Yes |
| form_start | Someone starts typing in the form | page_path, language, treatment | No |
| language_switch | Language switch used | from_language, to_language | No |
| treatment_view | Treatment page viewed | treatment, language | No |`,
        },
        {
          id: "utm-convention",
          title: "UTM naming convention",
          kind: "text",
          note: "Lowercase, no spaces, hyphens between words. Share with everyone who makes links.",
          body: `utm_source   = where: google, meta, instagram, tiktok, youtube, email, whatsapp, partner-name
utm_medium   = type: cpc, paid-social, organic-social, email, referral
utm_campaign = language-treatment-market-goal, e.g. ar-dental-implants-gulf-leads
utm_content  = the ad, e.g. video-01, carousel-before-after
utm_term     = keyword group, search ads only, e.g. implants-price

Example:
https://clinic.com/ar/dental-implants?utm_source=google&utm_medium=cpc&utm_campaign=ar-dental-implants-gulf-leads&utm_content=rsa-01

Rules
- Never rename a running campaign. Make a new one
- Log every link with date and author
- The treatment in utm_campaign matches the landing page`,
        },
        {
          id: "offline-import",
          title: "Google Ads offline conversion import, step by step",
          kind: "text",
          note: "A developer or ads manager does steps 1 to 3 once. A coordinator does step 4 weekly.",
          body: `1. Turn on auto-tagging
Google Ads > Admin > Account settings > Auto-tagging: on. Ad clicks now add ?gclid=... to your link.

2. Save the click ID
Add a hidden field named gclid to every form. A small script reads it from the link, keeps it 90 days (cookie or local storage) and fills the field. For WhatsApp leads, save page and campaign. Later, ask about "enhanced conversions for leads".

3. Create the conversion action
Google Ads > Goals > Conversions > Summary > New conversion action > Import > CRM, file or other data source > Track conversions from clicks. Name: "Booked patient". Category: Qualified lead or Converted lead. Value: different per conversion. Count: one. Window: 90 days.

4. Upload weekly
Take rows with booked = yes and a gclid. Use exactly these columns:
Google Click ID | Conversion Name | Conversion Time | Conversion Value | Conversion Currency
Time format: yyyy-mm-dd hh:mm:ss plus time zone, e.g. "2026-01-20 14:35:00 Europe/Istanbul".
Google Ads > Goals > Conversions > Uploads: upload the file or schedule a Google Sheet. Fix rejected rows.

5. Give it time
After 3 to 4 uploads, bid on "Booked patient", not clicks. Judge ads by cost per booked patient.`,
        },
      ],
      mistakes: [
        "Reports with clicks but never bookings",
        "Three agencies' tags, counting differently",
        "UTM links typed by hand",
        "A tracker only the agency fills in",
      ],
      done: "One sheet shows bookings per campaign, and Google Ads sees them.",
    },
    {
      id: "feedback",
      title: "Reviews and follow-up that bring the next patient",
      promise: "You get a review routine, plus a 30-day plan for the whole playbook.",
      minutes: 4,
      why: [
        "Patients read reviews first. Ten recent reviews naming the treatment beat a hundred old ones.",
        "Follow-up brings referrals. Patients you contact after they fly home tell their friends.",
        "No software needed. Pick the moment, save the messages, give one person the job.",
      ],
      steps: [
        {
          title: "Choose the moment",
          body: "Ask at the last appointment, when the result shows, or at the one-week follow-up. Not on day one.",
        },
        {
          title: "Make it a one-tap link",
          body: "Send the direct Google Business Profile review link. Ask them to mention the treatment and country.",
        },
        {
          title: "Answer every review within a week",
          body: "Thank by name and treatment. For bad reviews, say sorry, say what you did, move to WhatsApp. Never argue in public.",
        },
        {
          title: "Show real reviews on treatment pages",
          body: "Show two or three per treatment, with name, country and a link to the original. Change them every three months.",
        },
        {
          title: "Follow up on schedule",
          body: "Message at one week, one month and six months. Ask for a review, a photo, and referrals. Log each message.",
        },
        {
          title: "Update the site monthly",
          body: "Each month, add new cases, reviews and patient questions to the site.",
        },
      ],
      checklist: [
        "Review moment on the coordinator's checklist",
        "Review link saved as a quick reply",
        "Every review answered within a week",
        "Bad reviews moved to WhatsApp",
        "Linked reviews on each treatment page",
        "1-week, 1-month, 6-month messages sent",
        "Follow-ups logged in the tracker",
        "Site updated monthly",
      ],
      templates: [
        {
          id: "review-request",
          title: "Review request and follow-up messages",
          kind: "message",
          note: "Send from the clinic number. Use your direct review link.",
          body: `Review request, last visit or week one (EN):
Hello [name], it was a pleasure to look after you. If you are happy, a short review helps patients from [country]: [review link]. Please mention your [treatment] and country. Thank you, [coordinator].

One-week follow-up (EN):
Hello [name], one week since you flew home. How do you feel? Any pain or questions? [Dr. Name] reads messages the same day.

One-month follow-up (EN):
Hello [name], one month already. Is it healing well? A photo helps the doctor check. Review link: [review link].

Six-month follow-up (EN):
Hello [name], six months since your [treatment]. Could you send a new photo? If a friend is thinking about treatment, give them this number.

Reply to a good review (EN):
Thank you, [first name]. It was a pleasure to care for your [treatment].

Reply to a bad review (EN):
[First name], I am sorry, and thank you for telling us. I checked your file and [what you did or will do]. Please message me at [number] so I can help. [Name, role].`,
        },
        {
          id: "plan-30-days",
          title: "The 30-day plan (and the 2-hours-a-week version)",
          kind: "text",
          note: "Fastest wins first. Only 2 hours a week? Use the short version.",
          body: `Week 1: Capture (chapters 3 and 8)
- WhatsApp Business: profile, hours, away message
- Pre-filled button on every treatment page
- First-reply scripts; reply time on the site
- Five-field form, thank-you page, confirmation
- Lead tracker started, even on paper

Week 2: Answer (chapters 5 and 2)
- Rebuild one treatment page; add the price table
- Write the journey page; add its summary to treatment pages

Week 3: Trust (chapters 6, 7 and 10)
- Doctor profiles with facts; "best" claims removed
- Photo cards in rooms; consent form to the lawyer
- Review link and follow-ups saved; reviews answered

Week 4: Measure and speed (chapters 9, 4 and 1)
- GA4 events; UTM pattern shared
- Auto-tagging on; gclid saved; first offline upload
- Images compressed; video and sliders gone; speed log
- Translation brief sent for language one

If you only have 2 hours a week
- Week 1: WhatsApp buttons; first-reply script
- Week 2: Rebuild your best-selling treatment page
- Week 3: Lead tracker; ask leaving patients for reviews
- Week 4: Compress images, remove video; book a developer for GA4
Month two: one chapter a week, lowest audit answer first.`,
        },
      ],
      mistakes: [
        "Asking for a review a month later",
        "Ignoring or arguing with bad reviews",
        "Testimonials with no name or link",
        "No contact after payment",
      ],
      done: "Every patient was asked for a review, and every review has a reply.",
    },
  ],
  quickWins: [
    "Add a pre-filled WhatsApp button to your most visited treatment page",
    "Save a first-reply script with three questions, in each language",
    "Set WhatsApp hours and an away message asking for photo and country",
    "Show a from-price with three inclusions on your best-selling treatment",
    "Add days, fly-home day and inclusions to each treatment page",
    "Replace 'best clinic' with one checkable fact",
    "Compress your ten heaviest images to WebP, under 200 KB",
    "Replace the hero video with one photo",
    "Cut the form to five fields; show the reply time after sending",
    "Start a lead tracker sheet and log today's inquiries",
  ],
  summary: [
    "Patients abroad choose on a phone, in their own language.",
    "The first message comes by WhatsApp. Put a pre-filled button on every treatment page.",
    "Reply within minutes, with three questions.",
    "Show price and days openly: from-price, inclusions, fly-home day.",
    "One page explains the whole trip, with a named person at each stage.",
    "Build trust with facts patients can check.",
    "Keep treatment pages under 2.5 seconds on a real phone.",
    "Log every lead with its source. Send bookings to Google Ads weekly.",
    "Ask for reviews at the last visit. Follow up at one week, one month, six months.",
    "Want it done for you? The Clinic Website package builds chapters 1 to 8. The Clinic Growth System adds tracking, CRM and the ads handoff (chapters 9 and 10).",
  ],
};
