"use client"
import {  Plus } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

export default function AddBook() {
  return (
    <Link href="/home/books/addBook">
      <Button className="flex items-center gap-1 text-white bg-[#2F8D46] hover:bg-[#1B5E20] " >
        <Plus className="h-4 w-4" />
        Add Book
      </Button>
    </Link>
  );
}
