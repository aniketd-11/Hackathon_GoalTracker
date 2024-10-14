// pages/api/downloadReport.js
import { NextResponse } from "next/server";
import axios from "axios";

export async function GET() {
  try {
    const api = `${process.env.BACKEND_API}/tracker/download?templateType=T_M`;

    const response = await axios.get(api, {
      responseType: "arraybuffer", // Important for handling binary data
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store", // Ensure no caching
      },
    });

    // Check if the response was successful
    if (response.status !== 200) {
      throw new Error("Error occurred while fetching the report");
    }

    // Set the headers for file download
    const headers = {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // Change this if your file type differs
      "Content-Disposition": `attachment; filename=goal_tracker_report.xlsx`, // You can set this dynamically if needed
      "Cache-Control": "no-store",
    };

    // Return the response as a binary file
    return new NextResponse(response.data, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.log("Error:", error);
    return NextResponse.json(
      { error: "Error occurred while fetching the report" },
      { status: 500 }
    );
  }
}
