import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import https from "https";

export async function GET(
  request: NextRequest,
  { params }: { params: { templateType: string } }
) {
  try {
    const templateType = params.templateType;

    const api = `${process.env.BACKEND_API}/tracker/get-trackerActions`;

    const response = await axios.get(api, {
      params: { templateType },
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
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
