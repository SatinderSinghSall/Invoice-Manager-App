"use client";

import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { FaTrashAlt } from "react-icons/fa";
import { Input } from "../ui/input";

function DeleteModal({ title, description, password, onClick }) {
  const [keyword, setKeyword] = useState("");

  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <FaTrashAlt size={22} color="red" className="cursor-pointer" />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>{description}</AlertDialogDescription>
            <p>
              To Delete: Type <b>{password}</b> in the input field.
            </p>
            <Input
              className="border-red-600"
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Enter the keyword..."
            />
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel className="w-full">
              No, Cancel.
            </AlertDialogCancel>
            {keyword === password && (
              <AlertDialogAction onClick={onClick}>
                Yes, Delete.
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default DeleteModal;
