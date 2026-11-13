/**
 * Types and interfaces for the NSK AI Chapter Hub.
 */

export type ChapterStatus = "interim" | "chartered" | "probation";
export type MouStatus = "signed" | "under_review" | "pending" | "exempt";
export type RequestType = "event" | "finance" | "partnership";
export type RequestStatus = "pending" | "approved" | "changes_requested" | "rejected";
/** "treasurer" is the stored key for the Programs Coordinator seat; the key is
 * kept because accounts are stored under it. */
export type OfficerRole = "lead" | "deputy" | "treasurer";

export interface Chapter {
  id: string;
  institution: string;
  country: string;
  status: ChapterStatus;
  charterDate?: string;
  charterNumber?: string;
  leadName: string;
  leadEmail: string;
  deputyName?: string;
  deputyEmail?: string;
  treasurerName?: string;
  treasurerEmail?: string;
  facultyRepName?: string;
  facultyRepDepartment?: string;
  facultyRepEmail?: string;
  facultyRepConfirmed: boolean;
  whatsappGroupLink?: string;
  whatsappGroupVerified: boolean;
  udaraMouStatus: MouStatus;
  countryDirectorName: string;
  countryDirectorEmail: string;
  totalMembers: number;
  signedAgreement: boolean;
  hasThreeExecutives: boolean;
  lastReportSubmittedMonth?: string;
  meetingsThisSemester: number;
}

export interface UdaraAmbassador {
  id: string;
  chapterId: string;
  name: string;
  department: string;
  phoneNumber: string;
  role: string;
}

export interface ClearanceRequest {
  id: string;
  chapterId: string;
  institution: string;
  type: RequestType;
  title: string;
  dateFiled: string;
  status: RequestStatus;
  amount?: string;
  notes?: string;
  eventDate?: string;
  format?: "online" | "physical" | "hybrid";
  attendeesEstimate?: number;
}

export interface HubSession {
  email: string;
  role: "admin" | "officer";
  chapterId?: string;
  officerRole?: OfficerRole;
  name: string;
}

/** One lead/deputy/treasurer seat on a chapter. Lifecycle: empty -> invited -> active,
 * and back to empty once revoked or once the account's one-year TTL expires it out of KV. */
export type HubSlot =
  | { status: "empty" }
  | { status: "invited"; token: string; createdAt: string; createdBy: string }
  | { status: "active"; email: string; name: string; createdAt: string; expiresAt: string };

export interface HubAccount {
  chapterId: string;
  role: OfficerRole;
  name: string;
  expiresAt: string;
  /** Salted scrypt hash (lib/hub-password.ts). Never sent to the browser. */
  passwordHash?: string;
}

export const OFFICER_ROLE_LABEL: Record<OfficerRole, string> = {
  lead: "Chapter Lead",
  deputy: "Deputy Lead",
  treasurer: "Programs Coordinator",
};
