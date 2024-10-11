export async function submitTrackingDetails({
  formattedGoals,
  trackerId,
}: {
  formattedGoals: { actionId: number; actionValue: string }[];
  trackerId: number;
}) {
  try {
    const response = await fetch(`/api/submitTrackingDetails`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store", // Ensure no caching
      },
      body: JSON.stringify({ formattedGoals, trackerId }),
    });

    if (!response.ok) {
      throw new Error("Error occurred while submitting tracking details");
    }

    // Parse the response if needed
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error:", error);
    throw error; // Rethrow or handle the error as needed
  }
}
