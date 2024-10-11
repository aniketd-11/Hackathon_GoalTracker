import React from "react";

const TableHeading = () => {
  return (
    <thead className="bg-white sticky top-0 ">
      <tr>
        <th scope="col" className="table-header">
          Project
        </th>
        <th scope="col" className="table-header">
          Sprint/Milestone
        </th>
        <th scope="col" className="table-header">
          Template type
        </th>
        <th scope="col" className="table-header">
          Status
        </th>
        <th scope="col" className="table-header">
          Start Date
        </th>
        <th scope="col" className="table-header">
          Due date
        </th>
      </tr>
    </thead>
  );
};

export default TableHeading;
