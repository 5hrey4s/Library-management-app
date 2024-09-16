import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BookOpen, BookMarked } from "lucide-react";
import { auth } from "@/auth";
import { booksRead, CurrentlyReading, fetchMemberByEmail } from "@/lib/data";
import EditProfile from "@/components/EditProfile";

async function getUserData() {
  const session = await auth();

  const member = await fetchMemberByEmail(session?.user?.email as string);
  return {
    name: session?.user?.name,
    email: session?.user?.email,
    avatar: session?.user.image,
    memberSince: "January 2023",
    booksRead: booksRead(session?.user?.email!),
    currentlyReading: CurrentlyReading(session?.user?.email!),
    ...member,
  };
}

export default async function ProfilePage({
  params,
}: {
  params: { tab: string };
}) {
  const user = await getUserData();

  console.log(params);
  const activeTab = params.tab || "profile";

  return (
    <div className="flex flex-col min-h-screen bg-[#f5f5f5]">
      <div className="flex flex-1">
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            {activeTab === "profile" && <ProfileContent user={user} />}
          </div>
        </main>
      </div>
    </div>
  );
}

async function ProfileContent({ user }: { user: any }) {
  const session = await auth();
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-[#2f8d46]">Profile</h1>
        <EditProfile user={user} />
      </div>
      <Card className="bg-white shadow-lg rounded-lg overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            <Avatar className="h-24 w-24 border-4 border-[#2f8d46]">
              <AvatarImage src={user.avatar!} alt={user.name!} />
              <AvatarFallback className="bg-[#e8f5e9] text-[#2f8d46]">
                {user.name
                  ?.split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-semibold text-[#333]">
                {user.name}
              </h2>
              <div className="text-[#666]">
                {session?.user.role === "admin" ? "Admin" : "Member"}
              </div>
              <p className="text-[#666]">{user.email}</p>
              <p className="text-sm text-[#888] mt-1">
                Member since {user.memberSince}
              </p>
            </div>
          </div>
          <Separator className="my-6 bg-[#e0e0e0]" />
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center space-x-4 bg-[#e8f5e9] p-4 rounded-lg">
              <BookOpen className="h-8 w-8 text-[#2f8d46]" />
              <div>
                <p className="text-sm text-[#666]">Books Read</p>
                <p className="text-2xl font-bold text-[#2f8d46]">
                  {user.booksRead}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4 bg-[#e8f5e9] p-4 rounded-lg">
              <BookMarked className="h-8 w-8 text-[#2f8d46]" />
              <div>
                <p className="text-sm text-[#666]">Currently Reading</p>
                <p className="text-2xl font-bold text-[#2f8d46]">
                  {user.currentlyReading}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
