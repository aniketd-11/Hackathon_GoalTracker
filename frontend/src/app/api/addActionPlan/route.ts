import { NextResponse } from "next/server";
import axios from "axios";
import https from "https";

export async function POST(request: Request) {
  const { trackerId, actionId, actionPlan, actionPlanETA } =
    await request.json();

  // Convert actionPlanETA to a Date object
  const parsedETA = new Date(actionPlanETA);

  // Ensure the date is valid
  if (isNaN(parsedETA.getTime())) {
    return NextResponse.json({ error: "Invalid ETA date" }, { status: 400 });
  }

  try {
    const response = await axios.post(
      `${process.env.BACKEND_API}/tracker/addActionPlan?trackerId=${trackerId}`,
      {
        actionId,
        actionPlan,
        actionPlanETA: parsedETA, // Send the parsed date
      },
      {
        httpsAgent: new https.Agent({ rejectUnauthorized: false }),
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
      response: data,
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
