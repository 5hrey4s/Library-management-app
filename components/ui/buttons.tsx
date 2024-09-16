"use client";

import { handleApprove, handleReject } from "@/lib/actions";
import { IRequest } from "@/Models/request.model";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { FaRegObjectGroup } from "react-icons/fa";
import { FcApproval, FcApprove, FcCancel } from "react-icons/fc";

export function AprroveButton({ data }: { data: IRequest }) {
  const router = useRouter();

  const handleClick = async () => {
    await handleApprove(data);
    toast({
      title: "Error",
      description: "Failed to approve request. Please try again.",
      variant: "destructive",
    });
    router.refresh();
    toast({
      title: "Request Approved",
      description: `Request for Book ID ${data.bookId} has been approved.`,
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

export function RejectButton({ data }: { data: IRequest }) {
  const router = useRouter();

  const handleClick = async () => {
    await handleReject(data);
    router.refresh();
    toast({
      title: "Request Rejected",
      description: `Request for Book ID ${data.bookId} has been rejected.`,
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
