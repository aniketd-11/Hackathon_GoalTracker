import { NextResponse } from "next/server";
import axios from "axios";

export async function GET() {
  try {
    const response = await axios.get(
      `${process.env.BACKEND_API}/dashboard/qn/accounts`,
      {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store", // Ensure no caching
        },
      }
    );

    // Check if the response was successful
    if (response.status !== 200) {
      throw new Error("Error occurred while fetching accounts");
    }

    // Axios already parses the response data
    const data = response.data;

    // Return the response as JSON
    return NextResponse.json({
      data,
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
