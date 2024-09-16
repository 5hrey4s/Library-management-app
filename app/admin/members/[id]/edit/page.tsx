import { EditMember } from "@/components/ui/editmember";
import { fetchMemberById } from "@/lib/data";

export default async function Page({ params }: { params: { id: string } }) {
  const memberToBeEdited = await fetchMemberById(Number(params.id));
  return <EditMember member={memberToBeEdited!} />;
}
