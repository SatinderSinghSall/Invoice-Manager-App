import React from "react";
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

function ListInvoice({ invoices = [], pageCount, total }) {
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
                <TableCell className="font-medium">{index + 1}</TableCell>

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
              <TableCell colSpan="6" className="text-center text-gray-500">
                No invoices found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default ListInvoice;
