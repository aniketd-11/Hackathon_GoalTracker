"use client";
export async function changeRatingService(trackerId: number, rating: string) {
  try {
    const response = await fetch(`/api/changeRating`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store", // Ensure no caching
      },
      body: JSON.stringify({ trackerId, rating }),
    });

    // Check if the request was successful
    if (!response.ok) {
      throw new Error("Failed to fetch accounts");
    }

    // Parse the JSON response
    const res = await response.json();

    if (res?.status === 200) {
      return res;
    }

    // Assuming the API returns an array of accounts directly
  } catch (error) {
    console.error("Error fetching accounts:", error);
    throw error; // Re-throw the error for further handling if needed
  }
}
