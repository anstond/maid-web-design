import { PageHeader } from "@/components/account/AccountPrimitives";
import { ProfilePageSkeleton } from "@/components/account/ProfilePageSkeleton";

export default function ProfileLoading() {
  return (
    <>
      <PageHeader
        eyebrow="Account"
        title="Profile & Settings"
        description="Your personal information, home details, preferences, and security."
      />
      <ProfilePageSkeleton />
    </>
  );
}
