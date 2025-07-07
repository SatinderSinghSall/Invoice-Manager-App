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
  } else if (typeof error === "string") {
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

    //! Check if amount is a valid number:
    if (isNaN(amount)) {
      return {
        error: "Amount must be a valid number.",
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

export const getInvoices = async (params) => {
  const page = parseInt(params.page) || 1;
  const limit = parseInt(params.limit) || 10;
  const skip = (page - 1) * limit;

  const query = {
    ...(params.search && {
      $or: [
        { amount: { $regex: params.search, $options: "i" } },
        { status: { $regex: params.search, $options: "i" } },
        { "customer.name": { $regex: params.search, $options: "i" } },
        { "customer.email": { $regex: params.search, $options: "i" } },
      ],
    }),
  };

  try {
    await connectMongoDB();

    //! Convert to plain objects
    const rawInvoices = await Invoice.find(query)
      .skip(skip)
      .limit(limit)
      .lean();

    //! Manually convert ObjectId and Date fields to strings
    const invoices = rawInvoices.map((inv) => ({
      ...inv,
      _id: inv._id.toString(),
      createdAt: inv.createdAt?.toISOString() || "",
      updatedAt: inv.updatedAt?.toISOString() || "",
    }));

    const total = await Invoice.countDocuments(query);
    const pageCount = Math.ceil(total / limit);

    return {
      invoices,
      total,
      pageCount,
    };
  } catch (error) {
    console.log(`Error Getting Invoices: ${error}`);
    return {
      error: getErrorMessages(error),
    };
  }
};

export const deleteInvoice = async (id) => {
  try {
    await connectMongoDB();
    await Invoice.findByIdAndDelete(id);

    revalidatePath("/");

    return {
      message: "Invoice Deleted Successfully!",
    };
  } catch (error) {
    console.log(`Error Creating an Invoice: ${error}`);
    return {
      error: getErrorMessages(error),
    };
  }
};
