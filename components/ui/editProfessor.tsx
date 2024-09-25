"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "./button";

interface EditProfessorButtonProps {
  id: number; // Optional custom classes
}

export default function EditProfessor({ id }: EditProfessorButtonProps) {
  return (
    <Link href={`/admin/professors/${id}/edit`}>
      <Button
        variant="default"
        className="bg-[#9FA8A0] hover:bg-[#8A9389] text-white transition-colors duration-200"
      >
        <Plus className="h-4 w-4 mr-2" />
        Edit Professor
      </Button>
    </Link>
  );
}
