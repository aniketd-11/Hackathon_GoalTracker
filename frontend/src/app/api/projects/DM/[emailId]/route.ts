import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import https from "https";

export async function GET(
  request: NextRequest,
  { params }: { params: { emailId: string } }
) {
  try {
    const emailId = params.emailId;
    const api = `${process.env.BACKEND_API}/dashboard/dm/projects?email=${emailId}`;

    const response = await axios.get(api, {
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store", // Ensure no caching
      },
    });

    // Check if the response was successful
    if (response.status !== 200) {
      throw new Error("Error occurred while fetching accounts");
    }

    // Axios already parses the response data
    const data = response.data;

    // Return the response as JSON
    return NextResponse.json({
      data: data,
      status: 200,
    });
  } catch (error) {
    console.log("Error:", error);
    return NextResponse.json(
      { error: "Error occurred while fetching accounts" },
      { status: 401 }
    );
  }
}
