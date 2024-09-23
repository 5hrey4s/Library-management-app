import { derivePrice } from "@/lib/currencyConversion";
import { useFormatter } from "next-intl";
import React, { useState, use } from "react";

type PriceTagProps = {
  price: number;
};

const PriceTag: React.FC<PriceTagProps> = async ({ price }) => {
  try {
    const formattedPrice = await derivePrice(price);

    return <span>{formattedPrice}</span>;
  } catch (error) {
    console.error("Error fetching price:", error);
    return <span>--</span>;
  }
};

export default PriceTag;
