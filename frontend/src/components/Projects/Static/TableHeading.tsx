import React from "react";
import {
  // TableBody,
  // TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const TableHeading = () => {
  return (
    <TableHeader className="bg-white sticky top-0 ">
      <TableRow>
        <TableHead scope="col" className="table-header">
          Project
        </TableHead>
        <TableHead scope="col" className="table-header">
          Sprint/Milestone
        </TableHead>
        <TableHead scope="col" className="table-header">
          Template type
        </TableHead>
        <TableHead scope="col" className="table-header">
          Status
        </TableHead>
        <TableHead scope="col" className="table-header">
          Start Date
        </TableHead>
        <TableHead scope="col" className="table-header">
          Due date
        </TableHead>
        <TableHead scope="col" className="table-header">
          Actions
        </TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default TableHeading;
