import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const trackerId = formData.get("trackerId");
  const actionValueDTOsJson = formData.get("actionValueDTOsJson");
  console.log(actionValueDTOsJson);

  try {
    const response = await axios.post(
      `${process.env.BACKEND_API}/tracker/add-trackerActionValue?trackerId=${trackerId}`,
      { actionValueDTOsJson },
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "Cache-Control": "no-store",
        },
      }
    );

    if (response.status !== 200) {
      throw new Error("Submission failed");
    }
    console.log(response);

    const data = response.data;

    return NextResponse.json({
      response: data,
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Submission error" }, { status: 401 });
  }
}
