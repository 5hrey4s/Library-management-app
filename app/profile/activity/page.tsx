import { auth } from "@/auth";
import { ActivityComponent } from "@/components/ActivityComponent";
import BookCard from "@/components/ui/flipcard";
import { fetchMemberByEmail, fetchMyTransactions } from "@/lib/data";
import { ITransaction } from "@/Models/transaction.model";
import React from "react";

// This would typically come from your data fetching logic
// const dummyBook = {
//   id: 1,
//   title: "The Great Gatsby",
//   author: "F. Scott Fitzgerald",
//   publisher: "Scribner",
//   genre: "Classic",
//   isbnNo: "9780743273565",
//   numOfPages: 180,
//   totalNumOfCopies: 10,
//   availableNumberOfCopies: 3,
//   image_url: "https://example.com/gatsby.jpg", // URL of the book cover
// };
export default async function ActivityPage() {
  const session = await auth();
  const user = await fetchMemberByEmail(session?.user.email!);
  const mockTransactions: ITransaction[] = await fetchMyTransactions(user?.id!);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Your Library Activity</h1>
      <ActivityComponent transactions={mockTransactions} />
      
    </div>
  );
}
