import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(
  request: NextRequest,
  { params }: { params: { accountId: number } }
) {
  try {
    const accountId = params.accountId;

    const api = `${process.env.BACKEND_API}/dashboard/qn/projects?accountId=${accountId}`;
    console.log(api);

    const response = await axios.get(api, {
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
