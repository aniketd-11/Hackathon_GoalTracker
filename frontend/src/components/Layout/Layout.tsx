"use client";
import * as React from "react";

// import Sidebar from "../Sidebar/Sidebar";
import withAuth from "@/components/withAuth";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Props = {
  children: React.ReactNode;
  page: string;
};

// layout has Header and Sidebar as a components

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <React.Fragment>
      <ToastContainer />
      {children}
    </React.Fragment>
  );
};

export default withAuth(Layout);
