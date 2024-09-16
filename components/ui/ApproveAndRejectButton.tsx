"use client";
import { IRequest, IRequestBase } from "@/Models/request.model";
import { RequestRepository } from "@/Repositories/request.repository";
import { TransactionRepository } from "@/Repositories/transaction.repository";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { FC } from "react";

interface ApproveAndRejectButtonProps {
  data: IRequest;
  className: string;
  onClick: ()=> void
}

const ApproveAndRejectButton: FC<ApproveAndRejectButtonProps> = ({
  data,
  className,
  onClick
}) => {
 
  return (
    <button
      className={`${className}`}
      onClick={onClick}
    >
      Borrow
    </button>
  );
};

export default ApproveAndRejectButton;
