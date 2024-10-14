import axios from "axios";

export async function downloadReportService() {
  try {
    const response = await axios.get(`/api/downloadReport`, {
      responseType: "blob", // Important for file downloads
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    });

    // Check if the request was successful
    if (response.status !== 200) {
      throw new Error("Failed to fetch report");
    }

    return response; // Return the full response to access headers
  } catch (error) {
    console.error("Error fetching report:", error);
    throw error;
  }
}
