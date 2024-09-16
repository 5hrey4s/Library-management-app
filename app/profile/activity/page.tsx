import { auth } from "@/auth";
import { ActivityComponent } from "@/components/ActivityComponent";
import { fetchMemberByEmail, fetchMyTransactions } from "@/lib/data";
import { ITransaction } from "@/Models/transaction.model";
import React from "react";

// This would typically come from your data fetching logic

export default async function ActivityPage() {
  const session = await auth();
const user = await fetchMemberByEmail(session?.user.email!)
const mockTransactions: ITransaction[] = await fetchMyTransactions(user?.id!)

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Your Library Activity</h1>
      <ActivityComponent transactions={mockTransactions} />
    </div>
  );
}
