import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(
  request: NextRequest,
  { params }: { params: { trackerId: number } }
) {
  try {
    const trackerId = params.trackerId;

    const api = `${process.env.BACKEND_API}/tracker/getGoalTrackerWithActionsById`;

    const response = await axios.get(api, {
      params: { trackerId },
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store", // Ensure no caching
      },
    });

    // Return the response as JSON
    return NextResponse.json({
      data: response.data,
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
