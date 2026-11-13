import type { Chapter, UdaraAmbassador, ClearanceRequest, HubSession } from "./hub-types";

/** Admin emails come from ADMIN_EMAILS (comma separated). Outside production the two
 * main admins apply by default so the hub is usable locally without configuring it. */
const DEV_FALLBACK_ADMIN_EMAILS = ["nsukka.ai@gmail.com", "nskai.org@gmail.com"];

export function getAdminEmails(): string[] {
  const envEmails = process.env.ADMIN_EMAILS;
  if (envEmails) {
    return envEmails.split(",").map((e) => e.trim().toLowerCase());
  }
  if (process.env.NODE_ENV === "production") {
    console.warn("ADMIN_EMAILS is not set — no one can sign in as a Chapter Hub admin.");
    return [];
  }
  return DEV_FALLBACK_ADMIN_EMAILS.map((e) => e.toLowerCase());
}

export function isAdminEmail(email: string): boolean {
  return getAdminEmails().includes(email.trim().toLowerCase());
}

/** Where chapter officers send any question or complaint. */
export const HUB_SUPPORT_EMAIL = "nskai.org@gmail.com";

/** Link to the charter document. The hub shows its button only once this is set. */
export const CHARTER_DOCUMENT_URL =
  "https://drive.google.com/drive/folders/1j94MBY-FuOfTmzBAxFAJ3X9iD431iJ1v?usp=sharing";

/** Official Google Form submission links (the last four are still placeholders
 * and are not linked from the hub until real ones exist). */
export const GOOGLE_FORM_LINKS = {
  monthlyReport: "https://forms.gle/Yo8gzrtVDqSNLWeP6",
  monthlyReportFr: "https://forms.gle/GFooid2XbNjNRioe7",
  workshopRequest: "https://forms.gle/Heu5TryXTJhqjNEL7",
  workshopRequestFr: "https://forms.gle/5zg4wjcT6cJiwL9EA",
  financialRequest: "https://docs.google.com/forms/d/e/1FAIpQLSc-finance-request/viewform",
  groupRegistration: "https://docs.google.com/forms/d/e/1FAIpQLSc-whatsapp-group/viewform",
  partnershipClearance: "https://docs.google.com/forms/d/e/1FAIpQLSc-partnership/viewform",
  handoverChecklist: "https://docs.google.com/forms/d/e/1FAIpQLSc-handover/viewform",
};

/** Official Brand, Flyer & Presentation links */
export const BRAND_ASSET_LINKS = {
  logoPackZip: "/downloads/nsk-ai-brand-pack.zip",
  logoSvgLight: "/downloads/nsk-ai-logo-light.svg",
  logoSvgDark: "/downloads/nsk-ai-logo-dark.svg",
  iconMarkSvg: "/downloads/nsk-ai-mark.svg",
  whatsappIconPng: "/downloads/nsk-ai-whatsapp-icon-template.png",
  canvaSquareFlyer: "https://www.canva.com/design/nskai-1080x1080-square",
  canvaStoryFlyer: "https://www.canva.com/design/nskai-1080x1920-vertical-story",
  canvaBannerFlyer: "https://www.canva.com/design/nskai-1920x1080-landscape-slide",
  presentationDeckGoogleSlides: "https://docs.google.com/presentation/d/nskai-official-deck/template/preview",
  presentationDeckPptx: "/downloads/NSK_AI_Official_Slide_Template.pptx",
  udaraMouTemplateDocx: "/downloads/Udara_2027_University_MOU_Template.docx",
  facultyInvitationLetterDocx: "/downloads/NSK_AI_Faculty_Representative_Invitation.docx",
  leadGuidelinesDocx: "/Downloads/NSK_AI_Chapter_Lead_Guidelines_EN.docx",
};

/** The real chapter roster: [id, institution, country]. Ids are permanent —
 * invite links and officer accounts in Upstash are stored under them, so add
 * new chapters but never rename an existing id. */
const CHAPTER_ROSTER: [string, string, string][] = [
  ["ahmadu-bello-university-zaria-ng", "Ahmadu Bello University, Zaria", "Nigeria"],
  ["babcock-university-ng", "Babcock University", "Nigeria"],
  ["bayero-university-kano-ng", "Bayero University Kano", "Nigeria"],
  ["bowen-university-ng", "Bowen University", "Nigeria"],
  ["federal-university-dutse-ng", "Federal University Dutse", "Nigeria"],
  ["federal-university-of-health-sciences-ila-orangun-ng", "Federal University of Health Sciences, Ila Orangun", "Nigeria"],
  ["federal-university-of-technology-minna-ng", "Federal University of Technology, Minna", "Nigeria"],
  ["imo-state-university-ng", "Imo State University", "Nigeria"],
  ["ladoke-akintola-university-of-technology-lautech-ng", "Ladoke Akintola University of Technology (LAUTECH)", "Nigeria"],
  ["lagos-state-university-ng", "Lagos State University", "Nigeria"],
  ["michael-okpara-university-of-agriculture-umudike-ng", "Michael Okpara University of Agriculture, Umudike", "Nigeria"],
  ["miva-open-university-ng", "Miva Open University", "Nigeria"],
  ["obafemi-awolowo-university-ng", "Obafemi Awolowo University", "Nigeria"],
  ["university-of-benin-ng", "University of Benin", "Nigeria"],
  ["university-of-ibadan-ng", "University of Ibadan", "Nigeria"],
  ["university-of-ilesa-ng", "University of Ilesa", "Nigeria"],
  ["university-of-lagos-ng", "University of Lagos", "Nigeria"],
  ["university-of-nigeria-nsukka-ng", "University of Nigeria, Nsukka", "Nigeria"],
  ["university-of-port-harcourt-ng", "University of Port Harcourt", "Nigeria"],
  ["jomo-kenyatta-university-of-agriculture-and-technology-jkuat-ke", "Jomo Kenyatta University of Agriculture and Technology (JKUAT)", "Kenya"],
  ["kenya-institute-of-software-engineering-thika-ke", "Kenya Institute of Software Engineering (Thika)", "Kenya"],
  ["kenyatta-university-ke", "Kenyatta University", "Kenya"],
  ["kibabii-university-ke", "Kibabii University", "Kenya"],
  ["laikipia-university-ke", "Laikipia University", "Kenya"],
  ["maseno-university-ke", "Maseno University", "Kenya"],
  ["meru-university-of-science-and-technology-ke", "Meru University of Science and Technology", "Kenya"],
  ["moi-university-ke", "Moi University", "Kenya"],
  ["muranga-university-of-technology-ke", "Murang’a University of Technology", "Kenya"],
  ["st-pauls-university-ke", "St Paul’s University", "Kenya"],
  ["university-of-eldoret-ke", "University of Eldoret", "Kenya"],
  ["university-of-nairobi-ke", "University of Nairobi", "Kenya"],
  ["arba-minch-university-et", "Arba Minch University", "Ethiopia"],
  ["debre-berhan-university-et", "Debre Berhan University", "Ethiopia"],
  ["debre-tabor-university-et", "Debre Tabor University", "Ethiopia"],
  ["dilla-university-et", "Dilla University", "Ethiopia"],
  ["haramaya-university-et", "Haramaya University", "Ethiopia"],
  ["hawassa-university-et", "Hawassa University", "Ethiopia"],
  ["jimma-institute-of-technology-et", "Jimma Institute of Technology", "Ethiopia"],
  ["new-generation-university-college-et", "New Generation University College", "Ethiopia"],
  ["st-marys-university-et", "St. Mary’s University", "Ethiopia"],
  ["university-of-gondar-et", "University of Gondar", "Ethiopia"],
  ["wollo-university-kombolcha-campus-et", "Wollo University, Kombolcha campus", "Ethiopia"],
  ["university-of-global-health-equity-rw", "University of Global Health Equity", "Rwanda"],
  ["university-of-rwanda-rw", "University of Rwanda", "Rwanda"],
  ["team-university-ug", "Team University", "Uganda"],
  ["mbarara-university-of-science-and-technology-ug", "Mbarara University of Science and Technology", "Uganda"],
  ["iai-togo-tg", "IAI-Togo", "Togo"],
  ["universite-de-kara-tg", "Université de Kara", "Togo"],
  ["universite-abdou-moumouni-ne", "Université Abdou Moumouni", "Niger"],
];

/** Only id, institution and country are real. The other fields are neutral
 * blanks kept so the Chapter type and the Google Sheet import still line up;
 * the hub does not display them. Officers come from invite-link accounts. */
export const SEED_CHAPTERS: Chapter[] = CHAPTER_ROSTER.map(([id, institution, country]) => ({
  id,
  institution,
  country,
  status: "interim",
  leadName: "",
  leadEmail: "",
  facultyRepConfirmed: false,
  whatsappGroupVerified: false,
  udaraMouStatus: "pending",
  countryDirectorName: "NSK AI Chapters Team",
  countryDirectorEmail: HUB_SUPPORT_EMAIL,
  totalMembers: 0,
  signedAgreement: false,
  hasThreeExecutives: false,
  meetingsThisSemester: 0,
}));

/** No ambassador directory or request history is recorded yet. */
export const SEED_UDARA_AMBASSADORS: UdaraAmbassador[] = [];
export const SEED_REQUESTS: ClearanceRequest[] = [];

/** Fetch chapters, with Next.js 1-week ISR caching if Google Sheet CSV URL is provided */
export async function getChapters(): Promise<Chapter[]> {
  const sheetUrl = process.env.GOOGLE_SHEET_CSV_URL;
  if (!sheetUrl) {
    return SEED_CHAPTERS;
  }

  try {
    const res = await fetch(sheetUrl, {
      next: { revalidate: 604800, tags: ["chapter-data"] },
    });
    if (!res.ok) {
      console.warn(`Failed to fetch Google Sheet CSV: ${res.statusText}. Using seed data.`);
      return SEED_CHAPTERS;
    }
    const csv = await res.text();
    const parsed = parseCsvToChapters(csv);
    return parsed.length > 0 ? parsed : SEED_CHAPTERS;
  } catch (err) {
    console.error("Error reading Google Sheet data, falling back to seed data:", err);
    return SEED_CHAPTERS;
  }
}

/** Parses published Google Sheet CSV into Chapter objects */
function parseCsvToChapters(csv: string): Chapter[] {
  const lines = csv.split("\n").map((l) => l.trim()).filter(Boolean);
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map((h) => h.replace(/^["']|["']$/g, "").trim().toLowerCase());
  const chapters: Chapter[] = [];

  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(",").map((c) => c.replace(/^["']|["']$/g, "").trim());
    if (!row[0]) continue;

    const getCol = (name: string, fallbackIndex = -1): string => {
      const idx = headers.indexOf(name);
      if (idx !== -1 && row[idx] !== undefined) return row[idx];
      if (fallbackIndex !== -1 && row[fallbackIndex] !== undefined) return row[fallbackIndex];
      return "";
    };

    const id = getCol("chapter_id", 0) || `chap-${i}`;
    const institution = getCol("institution", 1) || "University Campus";
    const country = getCol("country", 2) || "Global";
    const statusRaw = getCol("status", 3).toLowerCase();
    const status: Chapter["status"] =
      statusRaw === "chartered" ? "chartered" : statusRaw === "probation" ? "probation" : "interim";

    chapters.push({
      id,
      institution,
      country,
      status,
      charterNumber: getCol("charter_number", 4) || undefined,
      charterDate: getCol("charter_date", 5) || undefined,
      leadName: getCol("lead_name", 6) || "Chapter Lead",
      leadEmail: getCol("lead_email", 7) || "",
      deputyName: getCol("deputy_name", 8) || undefined,
      deputyEmail: getCol("deputy_email", 9) || undefined,
      treasurerName: getCol("treasurer_name", 10) || undefined,
      treasurerEmail: getCol("treasurer_email", 11) || undefined,
      facultyRepName: getCol("faculty_rep_name", 12) || undefined,
      facultyRepConfirmed: getCol("faculty_rep_confirmed", 13).toLowerCase() === "true" || getCol("faculty_rep_confirmed", 13).toLowerCase() === "yes",
      whatsappGroupLink: getCol("whatsapp_group_link", 14) || undefined,
      whatsappGroupVerified: true,
      udaraMouStatus: (getCol("udara_mou_status", 15) as Chapter["udaraMouStatus"]) || "pending",
      countryDirectorName: getCol("country_director_name", 16) || "Country Director",
      countryDirectorEmail: getCol("country_director_email", 17) || "director@nskai.org",
      totalMembers: parseInt(getCol("total_members", 18), 10) || 15,
      signedAgreement: true,
      hasThreeExecutives: true,
      lastReportSubmittedMonth: getCol("last_report_month", 19) || undefined,
      meetingsThisSemester: parseInt(getCol("meetings_count", 20), 10) || 1,
    });
  }

  return chapters;
}

export async function getChapterById(id: string): Promise<Chapter | null> {
  const chapters = await getChapters();
  return chapters.find((c) => c.id === id) || null;
}

export async function getUdaraAmbassadors(chapterId: string): Promise<UdaraAmbassador[]> {
  return SEED_UDARA_AMBASSADORS.filter((a) => a.chapterId === chapterId);
}

export async function getRequestsForChapter(chapterId: string): Promise<ClearanceRequest[]> {
  return SEED_REQUESTS.filter((r) => r.chapterId === chapterId);
}

export async function getAllRequests(): Promise<ClearanceRequest[]> {
  return SEED_REQUESTS;
}
