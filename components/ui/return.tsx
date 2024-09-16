"use client";

import { useState } from "react";
import { returnBook } from "@/lib/data";
import { Button } from "./button";
import { FC, ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";

interface ReturnBookButtonProps {
  className?: string;
  children: ReactNode;
  id: number;
}

const ReturnBookButton: FC<ReturnBookButtonProps> = ({
  className,
  children,
  id,
}) => {
  const [isReturning, setIsReturning] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleReturn = async () => {
    setIsReturning(true);
    try {
      await returnBook(id);
      toast({
        title: "Book returned successfully",
        description: "The book has been marked as returned in the system.",
        variant: "default",
      });
      router.refresh();
    } catch (error) {
      console.error("Error returning book:", error);
      toast({
        title: "Error returning book",
        description: "There was a problem returning the book. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsReturning(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className={className}>
          {children}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Book Return</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to return this book? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button 
              className={className} 
              onClick={handleReturn}
              disabled={isReturning}
            >
              {isReturning ? "Returning..." : "Confirm Return"}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ReturnBookButton;