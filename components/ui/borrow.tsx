"use client";
import { Button } from "./button";
import Link from "next/link";
import { FC, ReactNode } from "react";

interface BorrowButtonProps {
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children:ReactNode
}

const BorrowButton: FC<BorrowButtonProps> = ({ className, onClick,children }) => {
  return (
    <Button className={`${className}`} onClick={onClick}>
      {children}
    </Button>
  );
};

export default BorrowButton;
