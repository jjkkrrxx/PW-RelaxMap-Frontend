import ProfilePage from "@/components/profilepage/profilepage";

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  return <ProfilePage userId={userId} />;
}
