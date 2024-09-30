import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import crypto from "crypto";
import { Appenv } from "@/read-env";
import { addPayments } from "@/lib/actions";
// import Payment from "../../../database/model/Payment";
// import dbConnect from '../../../database/database';

// Make sure to load environment variables properly
const instance = new Razorpay({
  key_id: Appenv.RAZORPAY_KEY_ID || "rzp_test_V8RbPCpR6oZ2Db", // fallback in case env var is not set
  key_secret: Appenv.RAZORPAY_KEY_SECRET || "wHt8UgTsSVsG5PnVDz7J5yo5", // fallback in case env var is not set
});

export async function POST(req, res) {
  try {
    // Parse the request JSON
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
      professorId,
      userId,
    } = await req.json();

    // Log the received IDs
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    console.log("Received body:", body);

    // Ensure environment variables are loaded
    const secret = "wHt8UgTsSVsG5PnVDz7J5yo5";
    if (!secret) {
      console.error("RAZORPAY_APT_SECRET is not defined");
      return NextResponse.json(
        { message: "Server configuration error" },
        { status: 500 }
      );
    }

    // Generate HMAC signature
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    // If the signature is valid, proceed with saving the payment info
    if (isAuthentic) {
      console.log("Payment verification successful");

      // Uncomment and use your Payment model and DB connection if needed
      // await dbConnect();
      // await Payment.create({
      //   razorpay_order_id,
      //   razorpay_payment_id,
      //   razorpay_signature,
      // });
      await addPayments({
        amount: amount,
        orderId: razorpay_order_id,
        PaymentId: razorpay_payment_id,
        paymentStatus: "success",
        professorId: professorId,
        userId: userId,
      });
      return NextResponse.json({ message: "success" }, { status: 200 });
    } else {
      console.error("Payment verification failed");
      return NextResponse.json({ message: "fail" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error during payment verification:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
