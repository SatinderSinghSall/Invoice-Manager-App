"use client";

import React, { useEffect, useRef, useState } from "react";
import Search from "../widgets/Search";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import ReactPaginate from "react-paginate";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDebouncedCallback } from "use-debounce";
import Tooltip from "rc-tooltip";
import "rc-tooltip/assets/bootstrap_white.css";
import { RiMailSendLine } from "react-icons/ri";
import { FaEdit } from "react-icons/fa";
import Link from "next/link";
import DeleteModal from "../widgets/DeleteModel";
import { deleteInvoice } from "@/actions/invoiceActions";
import toast from "react-hot-toast";
import { sendEmail } from "@/actions/emailAction";

function ListInvoice({ invoices = [], pageNumber, total }) {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const [pageCount, setPageCount] = useState(1);
  const currentPage = useRef(1);
  const ITEMS_PER_PAGE = 5;

  const [search, setSearch] = useState("");

  const handleSearch = async (e) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", 1);
    if (search) {
      params.set("search", search);
    } else {
      params.delete("search");
    }
    router.replace(`${pathName}?${params.toString()}`);
  };

  const debouncedHandleSearch = useDebouncedCallback((e) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", 1);
    if (search) {
      params.set("search", search);
    } else {
      params.delete("search");
    }
    router.replace(`${pathName}?${params.toString()}`);
  }, 500);

  useEffect(() => {
    debouncedHandleSearch();
  }, [search]);

  useEffect(() => {
    if (total > 0) {
      setPageCount(Math.ceil(total / ITEMS_PER_PAGE));
    }
  }, [total]);

  // useEffect(() => {
  //   console.log("Invoices length:", invoices.length);
  //   console.log("Total invoices available:", total);
  // }, [invoices, total]);

  function handlePageClick(e) {
    const params = new URLSearchParams(searchParams.toString());
    const selectedPage = e.selected + 1;
    currentPage.current = selectedPage;
    params.set("page", selectedPage);
    router.replace(`${pathName}?${params.toString()}`);
  }

  async function onDeleteInvoice(id) {
    const response = await deleteInvoice(id);
    console.log(response);
    if (response?.error) {
      toast.error(response?.error);
    }
    if (response?.message) {
      toast.success(response?.message);
    }
  }

  async function sendThisInvoice() {
    console.log("Sending...");
    const response = await sendEmail({
      subject: "🔔 Invoice Notification!",
      message: "This is an Invoice test notification.",
      email: "satindersinghsall111@gmail.com",
    });
    if (response?.error) {
      toast.error(response?.error);
    }
    if (response?.message) {
      toast.success(response?.message);
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center border-b border-gray-300 pb-3 mb-4">
        <p className="text-sm text-gray-600">{total} Invoices</p>
        <Search
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search an Invoice..."
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">S/N</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.length > 0 ? (
            invoices.map((invoice, index) => (
              <TableRow key={invoice._id}>
                <TableCell className="font-medium">
                  {(pageNumber - 1) * ITEMS_PER_PAGE + index + 1}
                </TableCell>

                <TableCell>
                  <div className="flex-start space-x-2">
                    <span>
                      <Avatar>
                        <AvatarImage
                          src={invoice?.customer?.image}
                          alt="Customers Images."
                        />
                        <AvatarFallback>
                          {invoice?.customer?.name?.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                    </span>
                    <span>{invoice.customer?.name || "-"}</span>
                  </div>
                </TableCell>

                <TableCell>{invoice.customer?.email || "-"}</TableCell>
                <TableCell>{invoice?.amount}</TableCell>
                <TableCell>
                  {format(new Date(invoice.createdAt), "MMM dd, yyyy")}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      invoice?.status === "Paid" ? "default" : "destructive"
                    }
                  >
                    {invoice.status}
                  </Badge>
                </TableCell>
                <TableCell className="flex space-x-3">
                  <span>
                    <Tooltip
                      placement="top"
                      trigger={["hover"]}
                      overlay={<span>Send an Email</span>}
                    >
                      <RiMailSendLine
                        size={24}
                        color="purple"
                        className="cursor-pointer"
                        onClick={() => sendThisInvoice(invoice)}
                      />
                    </Tooltip>
                  </span>

                  <span>
                    <Link href={`/?id=${invoice?._id}`}>
                      <Tooltip
                        placement="top"
                        trigger={["hover"]}
                        overlay={<span>Edit an Invoice</span>}
                      >
                        <FaEdit
                          size={24}
                          color="green"
                          className="cursor-pointer"
                        />
                      </Tooltip>
                    </Link>
                  </span>

                  <span>
                    <Tooltip
                      placement="top"
                      trigger={["hover"]}
                      overlay={<span>Delete an Invoice</span>}
                    >
                      <span className="cursor-pointer text-red-500 font-medium">
                        <DeleteModal
                          title="Delete Invoice"
                          description="Are you sore you want to delete this invoice?"
                          password="delete"
                          onClick={() => onDeleteInvoice(invoice?._id)}
                        />
                      </span>
                    </Tooltip>
                  </span>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan="7" className="py-10">
                <div className="flex flex-col items-center justify-center text-center text-muted-foreground space-y-6">
                  <div className="bg-muted p-5 rounded-full shadow-inner animate-pulse transition duration-300 ease-in-out">
                    <FileText className="w-7 h-7 text-gray-400" />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                      No invoices found
                    </h3>
                    <p className="text-sm text-gray-500 mt-2 max-w-xs">
                      You haven’t created any invoices yet. Get started by
                      creating your first invoice.
                    </p>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="transition-all duration-200 hover:scale-105 hover:shadow-md"
                  >
                    Create Invoice
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {invoices?.length > 0 && (
        <ReactPaginate
          breakLabel="..."
          nextLabel="Next"
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={pageCount}
          previousLabel="Previous"
          renderOnZeroPageCount={null}
          marginPagesDisplayed={2}
          containerClassName="pagination"
          pageLinkClassName="page-num"
          previousLinkClassName="page-num"
          nextLinkClassName="page-num"
          activeLinkClassName="activePage"
          forcePage={pageNumber - 1}
        />
      )}
    </div>
  );
}

export default ListInvoice;
