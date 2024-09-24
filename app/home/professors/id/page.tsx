// pages/professorsPage.tsx
import CalendlyEmbed from "@/components/CalendlyEmbed";
import { fetchProfessorById } from "@/lib/actions";
import React from "react";

const ProfessorsPage = async ({ params }: { params: { id: string } }) => {
  // const professorCalendlyLink =
  //   "https://calendly.com/shreyas-salyan-codecraft/30min"; // Replace with your actual Calendly link
  const id = params.id;

  const professor = await fetchProfessorById(Number(id));
  console.log(professor)
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Professors</h1>
      <CalendlyEmbed calendlyLink={professor?.calendlyLink!} />
    </div>
  );
};

export default ProfessorsPage;

// import BookForm from "@/components/admin/BookForm";
// import CalendlyWidget from "@/components/CalendlyWidget";
// import DataNotFound from "@/components/DataNotFound";
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbList,
//   BreadcrumbLink,
//   BreadcrumbPage,
//   BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb";
// import { fetchBookById, fetchProfessorById } from "@/lib/actions";
// export default async function Page({ params }: { params: { id: string } }) {
//   const id = params.id;
//   console.log("id", id);
//   const professor = await fetchProfessorById(Number(id));
//   if (!professor.calendlyLink) {
//     return (
//       <>
//         <DataNotFound
//           title="No Data Available"
//           message="It looks like we don't have any data to display at the moment."
//           actionLabel="Go Back"
//         />
//       </>
//     );
//   }
//   return (
//     <>
//       <CalendlyWidget url={professor.calendlyLink} />
//     </>
//   );
// }
