import React from "react";
import { BiSearch } from "react-icons/bi";
import { Input } from "../ui/input";

export default function Search({ value, onChange, defaultValue, placeholder }) {
  return (
    <div className="relative w-full sm:w-72">
      <BiSearch
        size={20}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
      />
      <Input
        type="text"
        placeholder={placeholder}
        className="
          pl-10 pr-4 py-2 
          w-full 
          rounded-xl 
          bg-gray-50 
          border border-gray-300 
          focus:outline-none focus:border-blue-500 
          shadow-sm 
          transition duration-200
        "
        value={value}
        onChange={onChange}
        defaultValue={defaultValue}
      />
    </div>
  );
}
