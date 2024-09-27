"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { addProfessor } from "@/lib/actions";
import { Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";

export default function AddProfessor() {
  const initialState: { message: string; errors: any } = {
    message: "",
    errors: {},
  };
  const [state, formAction, isPending] = useActionState(
    addProfessor,
    initialState
  );
  const router = useRouter();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    console.log(state.message);
    setIsOpen(false);
    if (state.message === "Success") {
      toast({
        title: "Success",
        description: "Book added successfully to the library.",
        duration: 2000,
        className: "bg-green-100 border-green-500 text-green-800 shadow-lg",
      });
    } else if (state.message && state.message !== "Success") {
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
        <Button className="bg-orange-500 hover:bg-orange-600 text-white">
          <Plus className="mr-2 h-4 w-4" />
          Add Professor
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-orange-50 border-orange-200">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-orange-800">
            Add New Professor
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-orange-700">
              Name
            </Label>
            <Input
              id="name"
              name="name"
              required
              className="border-orange-200 focus:border-orange-500 focus:ring-orange-500"
            />
            {state.errors?.name ? (
              <p className="text-red-500 text-sm">{state.errors.name}</p>
            ) : (
              <div className="min-h-1"></div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-orange-700">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              className="border-orange-200 focus:border-orange-500 focus:ring-orange-500"
            />
            {state.errors?.email ? (
              <p className="text-red-500 text-sm">{state.errors.email}</p>
            ) : (
              <div className="min-h-1"></div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="department" className="text-orange-700">
              Department
            </Label>
            <Input
              id="department"
              name="department"
              required
              className="border-orange-200 focus:border-orange-500 focus:ring-orange-500"
            />
            {state.errors?.department ? (
              <p className="text-red-500 text-sm">{state.errors.department}</p>
            ) : (
              <div className="min-h-1"></div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio" className="text-orange-700">
              Bio
            </Label>
            <Textarea
              id="bio"
              name="bio"
              required
              className="border-orange-200 focus:border-orange-500 focus:ring-orange-500"
            />
            {state.errors?.bio ? (
              <p className="text-red-500 text-sm">{state.errors.bio}</p>
            ) : (
              <div className="min-h-1"></div>
            )}
          </div>
          <Button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
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
