"use client";

import { handleApprove, handleReject } from "@/lib/actions";
import { IRequest } from "@/Models/request.model";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { FaRegObjectGroup } from "react-icons/fa";
import { FcApproval, FcApprove, FcCancel } from "react-icons/fc";

export function AprroveButton({
  data,
}: {
  data: { id: number; Status: string };
}) {
  const router = useRouter();

  const handleClick = async () => {
    const transaction = await handleApprove(data);
    toast({
      title: "Error",
      description: "Failed to approve request. Please try again.",
      variant: "destructive",
    });
    // router.refresh();
    toast({
      title: "Request Approved",
      description: `Request for Book ID ${
        transaction!.bookId
      } has been approved.`,
    });
  };

  return (
    <>
      <FcApproval />
      <Button
        onClick={handleClick}
        className="w-full justify-start font-normal"
        variant="ghost"
      >
        Approve
      </Button>
    </>
  );
}

export function RejectButton({ id }: { id: number }) {
  const router = useRouter();

  const handleClick = async () => {
    const transaction = await handleReject(id);
    router.refresh();
    toast({
      title: "Request Rejected",
      description: `Request for Book ID ${
        transaction!.bookId
      } has been rejected.`,
    });
  };

  return (
    <>
      <FcCancel />
      <Button
        onClick={handleClick}
        className="w-full justify-start font-normal"
        variant="ghost"
      >
        Reject
      </Button>
    </>
  );
}
