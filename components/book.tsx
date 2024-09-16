"use client";
import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils"; // Assuming you have a utility function for conditional classNames

interface BooksProps {
  isActive?: boolean; // Define the isActive prop with an optional type
}

export default function Books({ isActive = false }: BooksProps) {
  return (
    <Link href="/home/books">
      <Button
        className={cn(
          "flex items-center gap-1 font-bold tracking-widest bg-inherit hover:bg-inherit",
          isActive ? "text-[#2F8D46]" : "text-black",
          "hover:text-[#2F8D46]"
        )}
      >
        BOOKS
      </Button>
    </Link>
  );
}
