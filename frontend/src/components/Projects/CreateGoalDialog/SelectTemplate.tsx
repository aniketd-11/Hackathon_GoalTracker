"use client";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectTemplateProps {
  setTemplate: (template: string) => void; // A function that takes a string and returns void
}

const SelectTemplate = ({ setTemplate }: SelectTemplateProps) => {
  return (
    <>
      <Select onValueChange={setTemplate}>
        <SelectTrigger className="w-44 bg-blue-50 border-blue-200 hover:border-blue-300 focus:ring-blue-500">
          <SelectValue placeholder="Select template" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="FIXED_BID">Fixed bid</SelectItem>
          <SelectItem value="T_M">T & M</SelectItem>
          <SelectItem value="STAFFING">Staffing</SelectItem>
        </SelectContent>
      </Select>
    </>
  );
};

export default SelectTemplate;
