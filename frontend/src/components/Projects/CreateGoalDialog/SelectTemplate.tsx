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
  setTemplate: React.Dispatch<React.SetStateAction<string | null>>;
  page?: string;
}

const SelectTemplate = ({ setTemplate, page }: SelectTemplateProps) => {
  return (
    <>
      <Select
        onValueChange={(template) => {
          if (template === "all") {
            setTemplate(null); // Reset to show all templates
          } else {
            setTemplate(template); // Set selected template
          }
        }}
      >
        <SelectTrigger className="w-44 bg-blue-50 border-blue-200 hover:border-blue-300 focus:ring-blue-500">
          <SelectValue placeholder="Select template" />
        </SelectTrigger>
        <SelectContent>
          {/* Add "All Templates" option */}
          {page !== "goalTrackerForm" && (
            <SelectItem key="all" value="all">
              All templates
            </SelectItem>
          )}
          <SelectItem value="FIXED_BID">Fixed bid</SelectItem>
          <SelectItem value="T_M">T & M</SelectItem>
          <SelectItem value="STAFFING">Staffing</SelectItem>
        </SelectContent>
      </Select>
    </>
  );
};

export default SelectTemplate;
