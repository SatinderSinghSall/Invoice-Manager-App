"use server";

import { connectMongoDB } from "@/lib/mongoDB";
import Invoice from "@/models/invoiceModel";
import { revalidatePath } from "next/cache";

export const getErrorMessages = (error) => {
  let message;

  if (error instanceof Error) {
    message = error.message;
  } else if (error && typeof error === "object" && "message" in error) {
    message = String(error.message);
  } else if (typeof error === "String") {
    message = error;
  } else {
    message = "Something went wrong!";
  }

  return message;
};

export const createInvoice = async (formData) => {
  const { customer, amount, status } = formData;

  try {
    if (!amount || !customer || !status) {
      return {
        error: "Please fill all the details.",
      };
    }

    await connectMongoDB();
    await Invoice.create({
      customer,
      amount,
      status,
    });

    revalidatePath("/");

    return {
      message: "Invoice Created Successfully!",
    };
  } catch (error) {
    console.log(`Error Creating an Invoice: ${error}`);
    return {
      error: getErrorMessages(error),
    };
  }
};
