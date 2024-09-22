import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { auth } from "@/auth";
import { getWishListByMemberId } from "@/lib/actions";
import { fetchBookById, fetchMemberByEmail } from "@/lib/data";
import { LikedBooksGrid } from "@/components/WishlistGrid";

export default async function WishlistPage() {
  const session = await auth();
  const user = await fetchMemberByEmail(session?.user.email!);

  const likedBookIds = await getWishListByMemberId(Number(user!.id));

  // Use Promise.all to ensure all book fetches are resolved
  const likedBooks = await Promise.all(
    likedBookIds.map(async (id) => await fetchBookById(id))
  );
  console.log(likedBookIds, likedBooks);

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-primary">Your Wishlist</h1>
        <Button className="flex items-center gap-2">
          <PlusCircle className="h-5 w-5" />
          Add Book
        </Button>
      </div>
      <LikedBooksGrid items={likedBooks} />
    </div>
  );
}
