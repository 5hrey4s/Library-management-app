"use client";
import { FaEdit } from "react-icons/fa";
import { Button } from "./ui/button"; // Adjust the import path if necessary
import Link from "next/link";

interface EditButtonProps {
  id: number; // Optional custom classes
}

export default function EditButton({ id }: EditButtonProps) {
  return (
    <Link href={`/home/books/${id}/edit`}>
      <Button
        className={`mt-auto font-semibold py-2 px-4 rounded-lg shadow-md transition-colors bg-[#357960] text-white`}
        onClick={async (e) => {
          e.stopPropagation();
        }}
      >
        {/* <FaEdit /> */}
        Edit
      </Button>
    </Link>
  );
}
