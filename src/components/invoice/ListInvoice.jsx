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

function ListInvoice({ invoices = [], pageNumber, total }) {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const [pageCount, setPageCount] = useState(1);
  const currentPage = useRef(1);
  const ITEMS_PER_PAGE = 5;

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

  return (
    <div>
      <div className="flex justify-between items-center border-b border-gray-300 pb-3 mb-4">
        <p className="text-sm text-gray-600">{total} Invoices</p>
        <Search placeholder="Search an Invoice..." />
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
                <TableCell>
                  {/* You can add edit/delete icons here */}
                  Edit Delete Email
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
