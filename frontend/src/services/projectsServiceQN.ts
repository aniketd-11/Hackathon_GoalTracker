"use client";
export async function getProjectsForQN(accountId: number) {
  try {
    const response = await fetch(`/api/projects/QN/${accountId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Check if the request was successful
    if (!response.ok) {
      throw new Error("Failed to fetch accounts");
    }

    // Parse the JSON response
    const res = await response.json();

    if (res?.status === 200) {
      return res?.data;
    }

    // Assuming the API returns an array of accounts directly
  } catch (error) {
    console.error("Error fetching accounts:", error);
    throw error; // Re-throw the error for further handling if needed
  }
}
