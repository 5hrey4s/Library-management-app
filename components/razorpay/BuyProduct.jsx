"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";
import { checkPayment } from "@/lib/actions";
import { IMember } from "@/Models/member.model";

const BuyProduct = ({ user, onCreditUpdate }) => {
  const router = useRouter();
  const [razorpayReady, setRazorpayReady] = useState(false);

  useEffect(() => {
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => {
          setRazorpayReady(true);
          resolve();
        };
        document.body.appendChild(script);
      });
    };

    loadRazorpayScript();
  }, []);

  const makePayment = async () => {
    if (!razorpayReady) {
      console.error("Razorpay is not ready");
      return;
    }

    const key = "rzp_test_V8RbPCpR6oZ2Db";

    try {
      const response = await fetch(
        "/api/razorpay"
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json = await response.json();
      const { order } = json;

      if (!order) {
        throw new Error("Order not found in the response");
      }

      const options = {
        key: key,
        name: "Library Management",
        currency: order.currency,
        amount: order.amount,
        order_id: order.id,
        description: "Credit Purchase",
        handler: async function (response) {
          const verificationResponse = await fetch(
            "/api/paymentverify",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                userId: user.id,
                amount: order.amount,
              }),
            }
          );

          const verificationResult = await verificationResponse.json();

          if (verificationResult?.message === "success") {
            console.log("Payment successful");
            onCreditUpdate(user.credits + order.amount / 100); // Assuming 1 credit = 1 currency unit
          } else {
            console.error("Payment verification failed.");
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone || "",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

      paymentObject.on("payment.failed", function (response) {
        console.error("Payment failed:", response.error);
      });
    } catch (error) {
      console.error("Error during payment process:", error);
    }
  };

  return (
    <Button
      onClick={makePayment}
      className="bg-green-500 hover:bg-green-600 text-white w-full"
    >
      <CreditCard className="mr-2 h-4 w-4" />
      Buy Credits
    </Button>
  );
};

export default BuyProduct;
