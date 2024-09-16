import {  Plus } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

export default function Temp() {
  return (
    <Link href="/signup">
      <Button className="flex items-center gap-1 text-white bg-teal-600 hover:bg-teal-700">
        <Plus className="h-4 w-4" />
        Add Book
      </Button>
    </Link>
  );
}
