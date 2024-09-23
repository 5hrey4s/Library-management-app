"use client";

import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function AddBook() {
  const t = useTranslations("AddBook");

  return (
    <Link href="/addBook">
      <Button 
        variant="default" 
        className="bg-[#9FA8A0] hover:bg-[#8A9389] text-white transition-colors duration-200"
      >
        <Plus className="h-4 w-4 mr-2" />
        {t("addBook")}
      </Button>
    </Link>
  );
}