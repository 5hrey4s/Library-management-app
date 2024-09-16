"use client";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import Link from "next/link";

interface TransactionsProps {
  isActive?: boolean; // Define the isActive prop with an optional type
}

export default function Transactions({ isActive = false }: TransactionsProps) {
  return (
    <Link href="/admin/transaction">
      <Button
        className={cn(
          "flex items-center gap-1 font-bold tracking-widest bg-inherit hover:bg-inherit",
          isActive ? "text-[#2F8D46]" : "text-black",
          "hover:text-[#2F8D46]"
        )}
      >
        TRANSACTIONS
      </Button>
    </Link>
  );
}
