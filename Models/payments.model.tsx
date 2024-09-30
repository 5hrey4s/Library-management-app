import { z } from "zod";

// Base interface for payment details
export interface IPaymentBase {
  professorId: number;   // ID of the professor associated with the payment
  userId: number;        // ID of the user making the payment
  orderId: string;       // Unique order identifier from Razorpay
  amount: number;        // Amount in the smallest currency unit (e.g., paise for INR)
  paymentStatus: string; // Current status of the payment (e.g., "Pending", "Completed", "Failed")
  PaymentId: string;     // Razorpay payment ID
}

// Extended interface for payment details including additional fields
export interface IPayment extends IPaymentBase {
  id: number; // Unique ID for the payment record
  createdAt: string; // Timestamp for when the payment was created
}

// Zod validation schema for payments
export const paymentSchema = z.object({
  professorId: z
    .number()
    .int({ message: "Professor ID must be an integer" })
    .min(1, { message: "Professor ID must be at least 1" }),
  userId: z
    .number()
    .int({ message: "User ID must be an integer" })
    .min(1, { message: "User ID must be at least 1" }),
  orderId: z
    .string()
    .min(1, { message: "Order ID is required" })
    .max(255, { message: "Order ID must be less than 255 characters" }),
  amount: z
    .number()
    .int({ message: "Amount must be an integer" })
    .min(1, { message: "Amount must be at least 1" }), // Ensure amount is at least 1 paise
  paymentStatus: z
    .string()
    .min(1, { message: "Payment status is required" })
    .max(50, { message: "Payment status must be less than 50 characters" }),
  paymentId: z
    .string()
    .min(1, { message: "Payment ID is required" })
    .max(255, { message: "Payment ID must be less than 255 characters" }),
  createdAt: z
    .date()
    .optional() // Optional as it may not be provided during creation
});

// Example function to validate a payment object
export const validatePayment = (paymentData: IPaymentBase) => {
  const result = paymentSchema.safeParse(paymentData);
  if (!result.success) {
    throw new Error(result.error.errors.map(e => e.message).join(", "));
  }
  return result.data;
};
