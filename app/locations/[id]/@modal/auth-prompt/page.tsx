import AuthPromptModal from "@/components/authpromptmodal/authpromptmodal";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AuthPromptModalPage({ params }: Props) {
  const { id } = await params;

  return <AuthPromptModal returnTo={`/locations/${id}`} />;
}
