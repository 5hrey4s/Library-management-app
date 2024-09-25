import { EditProfessor } from "@/components/ui/edirProfessorForm";
import { fetchProfessorById } from "@/lib/actions";
import { fetchBookById } from "@/lib/data";

export default async function Page({ params }: { params: { id: string } }) {
  const professorToBeEdited = await fetchProfessorById(Number(params.id));
  return <EditProfessor professor={professorToBeEdited!} />;
}
