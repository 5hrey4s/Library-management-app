"use client";

import { Button } from "./button";
import { FC, ReactNode, Suspense } from "react";
import { FaDollarSign, FaRupeeSign } from "react-icons/fa";
import { Skeleton } from "./skeleton";
import PriceTag from "../priceTag";

interface BuyButtonProps {
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children: ReactNode;
  price: number;
}

const BuyButton: FC<BuyButtonProps> = ({
  className,
  onClick,
  children,
  price,
}) => {
  return (
    <Button
      className={`${className} flex items-center justify-between px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200`}
      onClick={onClick}
    >
      <span>{children}</span>
      <div className="flex items-center ml-2">
        <Suspense fallback={<Skeleton />}>
          <span>{<PriceTag price={price}></PriceTag>}</span>
        </Suspense>
      </div>
    </Button>
  );
};

export default BuyButton;
