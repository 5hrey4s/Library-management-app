// pages/professorsPage.tsx
import { auth } from "@/auth";
import CalendlyEmbed from "@/components/CalendlyEmbed";
import { fetchProfessorById } from "@/lib/actions";
import { fetchMemberByEmail } from "@/lib/data";
import React from "react";

const Page = async ({ params }: { params: { id: string } }) => {
  const id = params.id;
  const session = await auth();
  const user = await fetchMemberByEmail(session?.user.email!);
  const prefill = { email: session?.user.email!, name: session?.user.name! };
  const professor = await fetchProfessorById(Number(id));
  console.log(professor);
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Professors</h1>
      <CalendlyEmbed
        calendlyLink={professor?.calendlyLink!}
        prefill={prefill}
        user={user!}
      />
    </div>
  );
};

export default Page;
