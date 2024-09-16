import React from 'react'
import { WishlistGrid } from '@/components/WishlistGrid'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'

// This would typically come from your data fetching logic
const mockWishlistItems = [
  {
    id: 1,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    coverImage: "https://example.com/to-kill-a-mockingbird-cover.jpg",
    description: "A classic of modern American literature, this novel explores racial injustice and the loss of innocence.",
  },
  {
    id: 2,
    title: "1984",
    author: "George Orwell",
    coverImage: "https://example.com/1984-cover.jpg",
    description: "A dystopian social science fiction novel and cautionary tale set in a totalitarian society.",
  },
  {
    id: 3,
    title: "Pride and Prejudice",
    author: "Jane Austen",
    coverImage: "https://example.com/pride-and-prejudice-cover.jpg",
    description: "A romantic novel of manners that follows the character development of Elizabeth Bennet.",
  },
  // Add more mock items as needed
]

export default function WishlistPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-primary">Your Wishlist</h1>
        <Button className="flex items-center gap-2">
          <PlusCircle className="h-5 w-5" />
          Add Book
        </Button>
      </div>
      <WishlistGrid items={mockWishlistItems} />
    </div>
  )
}