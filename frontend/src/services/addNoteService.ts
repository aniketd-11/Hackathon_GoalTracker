"use client";

export async function addNoteService(
  trackerId: number,
  userRole: string | undefined,
  note: string
) {
  try {
    const response = await fetch(`/api/addNote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store", // Ensure no caching
      },
      body: JSON.stringify({
        trackerId,
        userRole,
        note,
      }),
    });

    // Check if the request was successful
    if (!response.ok) {
      throw new Error("Failed to add action plan");
    }

    // Parse the JSON response
    const res = await response.json();

    if (res?.status === 200) {
      return res;
    }

    throw new Error("Unexpected response status");
  } catch (error) {
    console.error("Error adding action plan:", error);
    throw error; // Re-throw the error for further handling if needed
  }
}
