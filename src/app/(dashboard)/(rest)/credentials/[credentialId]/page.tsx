import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ credentialId: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { credentialId } = await params;

  if (!credentialId || typeof credentialId !== "string") {
    notFound();
  }

  return (
    <div>
      <h1>Credential ID: {credentialId}</h1>
    </div>
  );
};

export default Page;