import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: Request) {
  const req = await request.json();

  console.log(req);

  try {
    const response = await axios.post(
      `${process.env.BACKEND_API}/tracker/create-tracker`,

      req,

      {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store", // Ensure no caching
        },
      }
    );

    // Axios does not have 'ok', so we check the status directly
    if (response.status !== 200) {
      throw new Error("Login failed");
    }

    const data = response.data; // Axios already parses the response data

    return NextResponse.json({
      trackerId: data,
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 }
    );
  }
}