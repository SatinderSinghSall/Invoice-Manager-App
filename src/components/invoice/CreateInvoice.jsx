"use client";

import React, { useEffect, useState } from "react";
import ActionModal from "../widgets/ActionModal";
import { Button } from "../ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { SelectGroup, SelectLabel } from "@radix-ui/react-select";
import { Input } from "../ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { LoadingButton } from "../widgets/Loader";
import { useRouter, useSearchParams } from "next/navigation";
import {
  createInvoice,
  getInvoice,
  updateInvoice,
} from "@/actions/invoiceActions";
import toast from "react-hot-toast";

const customers = [
  {
    id: 1,
    name: "Akpareva Zino",
    image: "https://i.pravatar.cc/300?u=a042581f4e29026702d",
    email: "donaldzee.ng@gmail.com",
  },
  {
    id: 2,
    name: "Jane Doe",
    image: "https://i.pravatar.cc/300?u=a042581f4e29026703d",
    email: "janedoe@example.com",
  },
  {
    id: 3,
    name: "John Smith",
    image: "https://i.pravatar.cc/300?u=a042581f4e29026704d",
    email: "johnsmith@example.com",
  },
  {
    id: 4,
    name: "Emily Johnson",
    image: "https://i.pravatar.cc/300?u=a042581f4e29026705d",
    email: "emilyj@example.com",
  },
  {
    id: 5,
    name: "Michael Brown",
    image: "https://i.pravatar.cc/300?u=a042581f4e29026706d",
    email: "michaelb@example.com",
  },
  {
    id: 6,
    name: "Olivia Davis",
    image: "https://i.pravatar.cc/300?u=a042581f4e29026707d",
    email: "oliviad@example.com",
  },
  {
    id: 7,
    name: "William Garcia",
    image: "https://i.pravatar.cc/300?u=a042581f4e29026708d",
    email: "williamg@example.com",
  },
  {
    id: 8,
    name: "Sophia Martinez",
    image: "https://i.pravatar.cc/300?u=a042581f4e29026709d",
    email: "sophiam@example.com",
  },
  {
    id: 9,
    name: "James Wilson",
    image: "https://i.pravatar.cc/300?u=a042581f4e29026710d",
    email: "jamesw@example.com",
  },
  {
    id: 10,
    name: "Isabella Anderson",
    image: "https://i.pravatar.cc/300?u=a042581f4e29026711d",
    email: "isabellaa@example.com",
  },
];

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name is required!",
  }),

  status: z.string().min(2, {
    message: "Status is required!",
  }),

  amount: z.string().min(2, {
    message: "Amount is required!",
  }),
});

const CreateInvoice = () => {
  const [open, setOpen] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      status: "Unpaid",
      amount: "",
    },
  });

  async function onSubmit(values) {
    const { name, status, amount } = values;
    const customer = customers.find((c) => {
      return c.name === name;
    });
    const formData = { amount, customer, status, id: id ? id : "" };

    // console.log(values);
    if (id) {
      //! Update an Invoice:
      const response = await updateInvoice(formData);
      // console.log(response);
      if (response?.error) {
        toast.error(response?.error);
      }
      if (response?.message) {
        toast.success(response?.message);
      }

      form.reset();
      setOpen(false);
    } else {
      //! Create an Invoice:
      const response = await createInvoice(formData);
      // console.log(response);
      if (response?.error) {
        toast.error(response?.error);
      }
      if (response?.message) {
        toast.success(response?.message);
      }

      form.reset();
      setOpen(false);
    }
  }

  const isLoading = form.formState.isSubmitting;

  useEffect(() => {
    const fetchInvoice = async () => {
      const response = await getInvoice(id);
      const invoice = JSON.parse(response);
      form.setValue("name", invoice?.customer?.name);
      form.setValue("amount", invoice?.amount);
      form.setValue("status", invoice?.status);
    };

    if (id) {
      setOpen(true);
      fetchInvoice();
    }
  }, [id]);

  useEffect(() => {
    if (!open) {
      router.replace("/");
    }
  }, [open, router]);

  return (
    <div>
      <ActionModal
        title="Create Invoice"
        description="Create a new Invoice"
        trigger={
          <Button>
            <span>Create Invoice</span>
            <span className="text-lg">+</span>
          </Button>
        }
        open={open}
        setOpen={setOpen}
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a customer here." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>All Customers:</SelectLabel>
                        <>
                          {customers?.map((item) => {
                            const { name } = item;
                            return (
                              <SelectItem key={item.id} value={name}>
                                {name}
                              </SelectItem>
                            );
                          })}
                        </>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter amount..." {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Payment Status</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-2"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Unpaid" />
                        </FormControl>
                        <FormLabel className="font-normal">Unpaid</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Paid" />
                        </FormControl>
                        <FormLabel className="font-normal">Paid</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isLoading ? (
              <LoadingButton
                btnText="Loading..."
                btnVariant="outline"
                btnClass="w-full"
              />
            ) : (
              <Button type="submit" className="w-full">
                {id ? "Update Invoice" : "Create Invoice"}
              </Button>
            )}
          </form>
        </Form>
      </ActionModal>
    </div>
  );
};

export default CreateInvoice;
