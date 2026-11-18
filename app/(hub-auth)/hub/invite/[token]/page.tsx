import type { Metadata } from "next";
import { getInvite } from "@/lib/hub-kv";
import { getChapterById } from "@/lib/hub-data";
import { OFFICER_ROLE_LABEL, COUNTRY_ROLE_LABEL, countryFromScope } from "@/lib/hub-types";
import InviteActivateForm from "@/components/hub/InviteActivateForm";
import styles from "../invite.module.css";

export const metadata: Metadata = {
  title: "Activate Chapter Hub Access",
  description: "Create your NSK AI Chapter Hub account from an invite link.",
};

export default async function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const invite = await getInvite(token);

  if (!invite) {
    return (
      <div className={styles.page}>
        <div className={styles.card}>
          <div className={styles.logo}>NSK AI</div>
          <span className={styles.monoLabel}>Chapter Operations</span>
          <h1 className={styles.title}>Invite link invalid</h1>
          <p className={styles.desc}>
            This invite link has already been used, been revoked, or never existed. Ask your
            Country Director or NSK AI admin to issue a new one.
          </p>
        </div>
      </div>
    );
  }

  const country = countryFromScope(invite.chapterId);
  const chapter = country ? null : await getChapterById(invite.chapterId);
  const roleLabel = country
    ? COUNTRY_ROLE_LABEL[invite.role] ?? "Country team"
    : OFFICER_ROLE_LABEL[invite.role];
  const place = country ?? chapter?.institution;

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>NSK AI</div>
        <span className={styles.monoLabel}>Chapter Operations</span>
        <h1 className={styles.title}>
          Activate your {roleLabel} account
        </h1>
        <p className={styles.desc}>
          {place
            ? `You're creating the ${roleLabel} account for ${place}.`
            : `You're creating a ${roleLabel} account.`}{" "}
          This access stays valid for one year and can be revoked by an NSK AI admin at any time.
        </p>
        <InviteActivateForm token={token} presetName={invite.name} presetEmail={invite.email} />
      </div>
    </div>
  );
}
