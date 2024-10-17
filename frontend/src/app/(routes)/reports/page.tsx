"use client";
import SidebarLayout from "@/app/sidebar-layout";
import Layout from "@/components/Layout/Layout";
import SelectTemplate from "@/components/Projects/CreateGoalDialog/SelectTemplate";
import { Button } from "@/components/ui/button";
import { downloadReportService } from "@/services/downloadReportService";
import dynamic from "next/dynamic";
import React, { useState } from "react";

const Reports = () => {
  const [template, setTemplate] = useState<string | null>(null);

  const downloadReport = async () => {
    try {
      const response = await downloadReportService();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");

      // Extract filename from the Content-Disposition header if available
      const contentDisposition = response.headers["content-disposition"];
      const filename = contentDisposition
        ? contentDisposition.split("filename=")[1].replace(/"/g, "")
        : "goal_tracker_report.xlsx";

      a.href = url;
      a.download = filename;

      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading report:", error);
    }
  };
  return (
    <Layout>
      <SidebarLayout>
        <div className="flex items-center justify-center h-full gap-2">
          <SelectTemplate setTemplate={setTemplate} />
          {template && (
            <Button
              variant={template ? "default" : "ghost"}
              className="text-white bg-blue-600 hover:bg-blue-800"
              onClick={downloadReport}
            >
              Download consolidated report
            </Button>
          )}
        </div>
      </SidebarLayout>
    </Layout>
  );
};

export default dynamic(() => Promise.resolve(Reports), { ssr: false });
