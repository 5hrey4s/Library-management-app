"use client";

import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

export default function AddProfessor() {
  return (
    <Link href="/addProfessor">
      <Button
        variant="default"
        className="bg-[#9FA8A0] hover:bg-[#8A9389] text-white transition-colors duration-200"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Professor
      </Button>
    </Link>
  );
}
