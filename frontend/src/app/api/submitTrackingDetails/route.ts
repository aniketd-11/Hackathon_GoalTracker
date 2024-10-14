import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import https from "https";

export async function POST(request: NextRequest) {
  const formData = await request.formData();

  // console.log(formData);
  // Retrieve trackerId and actionValueDTOsJson from formData
  const trackerId = formData.get("trackerId");

  // Create a new FormData instance to store the filtered data
  const filteredFormData = new FormData();

  // Loop through the original formData and append all entries except trackerId
  formData.forEach((value, key) => {
    if (key !== "trackerId") {
      filteredFormData.append(key, value); // Add only keys that are not trackerId
    }
  });

  try {
    const response = await axios.post(
      `${process.env.BACKEND_API}/tracker/add-trackerActionValue?trackerId=${trackerId}`,
      filteredFormData, // Send the new formData with files

      {
        httpsAgent: new https.Agent({ rejectUnauthorized: false }),
        headers: {
          "Content-Type": "multipart/form-data",
          "Cache-Control": "no-store",
        },
      }
    );

    if (response.status !== 200) {
      throw new Error("Submission failed");
    }

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
