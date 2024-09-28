"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { inviteProfessor } from "@/lib/actions";
import { Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";

export default function AddProfessor() {
  const initialState: { message: string } = {
    message: "",
  };
  const [state, formAction, isPending] = useActionState(
    inviteProfessor,
    initialState
  );
  const router = useRouter();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    console.log(state.message);
    setIsOpen(false);
    if (state.message === "Professor created successfully!") {
      toast({
        title: "Success",
        description: state.message,
        duration: 2000,
        className: "bg-[#8A9389] border-[#696f68] text-white shadow-lg",
      });
    } else if (state.message && state.message !== "Professor created successfully!") {
      setIsOpen(true);
      toast({
        title: "Failure",
        description: `${state.message}`,
        duration: 5000,
        className: "bg-red-100 border-red-500 text-red-800 shadow-lg",
      });
    }
    router.refresh();
  }, [state.message, toast, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    formAction(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#8A9389] hover:bg-[#696f68] text-white">
          <Plus className="mr-2 h-4 w-4" />
          Add Professor
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-[#F5F5F7] border-[#8A9389]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#4A4F4D]">
            Add New Professor
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-[#4A4F4D]">
              Name
            </Label>
            <Input
              id="name"
              name="name"
              required
              className="border-[#8A9389] focus:border-[#696f68] focus:ring-[#696f68]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[#4A4F4D]">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              className="border-[#8A9389] focus:border-[#696f68] focus:ring-[#696f68]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="department" className="text-[#4A4F4D]">
              Department
            </Label>
            <Input
              id="department"
              name="department"
              required
              className="border-[#8A9389] focus:border-[#696f68] focus:ring-[#696f68]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio" className="text-[#4A4F4D]">
              Bio
            </Label>
            <Textarea
              id="bio"
              name="bio"
              required
              className="border-[#8A9389] focus:border-[#696f68] focus:ring-[#696f68]"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-[#8A9389] hover:bg-[#696f68] text-white"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding Professor...
              </>
            ) : (
              <>Add Professor</>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
