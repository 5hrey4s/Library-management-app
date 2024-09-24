"use server";
import AddProfessor from "@/components/addProfessor";
import ProfessorSection from "@/components/ProfessorSection";
import { fetchProfessors } from "@/lib/actions";
import { IProfessorBase } from "@/Models/professor.model";
import { IRequestBase } from "@/Models/request.model";
// import { fetchFilteredProfessors, fetchUserDetails } from "@/lib/actions";

export default async function Page({
  searchParams,
}: {
  searchParams: {
    query?: string;
    page?: string;
    sortBy?: string;
    sortOrder?: string;
  };
}) {
  const page = parseInt(searchParams?.page ?? "1");
  const limit = 8;
  const sortBy = (searchParams?.sortBy as keyof IProfessorBase) || "title";
  const sortOrder = searchParams?.sortOrder || "asc";

  const offset = (page - 1) * limit;
  const pageRequest = {
    offset,
    limit,
    search: searchParams?.query || "",
  };
  const sortOptions = { sortOrder, sortBy };

  // Fetching the list of professors and pagination details
  const { items, pagination } = await fetchProfessors(pageRequest);

  //   const totalPages = Math.ceil(Number(totalCount) / professorsPerPage);
  //   if (professors.length === 0) {
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
  return (
    <div className="flex-1 overflow-y-auto p-6">
      <h2 className="text-3xl font-bold mb-6">
        Book an Appointment with a Professor
      </h2>
      <AddProfessor />
      <ProfessorSection professors={items} />
    </div>
  );
}
