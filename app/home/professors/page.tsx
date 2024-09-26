"use server";

import { auth } from "@/auth";
import AddProfessor from "@/components/addProfessor";
import ProfessorSection from "@/components/ProfessorSection";
import UserAppointments from "@/components/UserAppointments";
import {
  fetchProfessors,
  getScheduledEvents,
  getUsersAppointments,
} from "@/lib/actions";
import { IProfessorBase } from "@/Models/professor.model";

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
  const session = await auth();
  const role = session?.user.role;
  const offset = (page - 1) * limit;
  const pageRequest = {
    offset,
    limit,
    search: searchParams?.query || "",
  };
  const sortOptions = { sortOrder, sortBy };
  const scheduledEvents = await getScheduledEvents();
  const { items, pagination } = await fetchProfessors(pageRequest);
  const userAppointments = await getUsersAppointments(session?.user.email!);
  console.log("userAppointments============", userAppointments);

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">
          Book an Appointment with a Professor
        </h2>
        <UserAppointments userAppointments={userAppointments} />
      </div>
      <ProfessorSection
        professors={items}
        scheduledEvents={scheduledEvents}
        role={role!}
      />
    </div>
  );
}
