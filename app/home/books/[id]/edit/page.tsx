import { EditBook } from "@/components/ui/editBookForm";
import { fetchBookById } from "@/lib/data";

export default async function Page({ params }: { params: { id: string } }) {
  const bookToBeEdited = await fetchBookById((Number(params.id)));
  return <EditBook book={bookToBeEdited!} />;
}
