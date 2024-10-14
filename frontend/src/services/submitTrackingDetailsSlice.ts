export async function submitTrackingDetails({
  formattedGoals,
  trackerId,
  fileUploads, // Add fileUploads as a parameter
}: {
  formattedGoals: {
    actionId: number;
    actionValue: string;
    isNotApplicable: boolean;
  }[];
  trackerId: number;
  fileUploads: { [key: string]: File }; // Add type for fileUploads
}) {
  try {
    const formData = new FormData();

    // Add the formattedGoals
    formData.append("actionValueDTOsJson", JSON.stringify(formattedGoals));

    // Add the trackerId
    formData.append("trackerId", trackerId.toString());

    // Append file uploads with their correct keys
    Object.entries(fileUploads).forEach(([key, file]) => {
      formData.append(key, file); // Append the actual File object
    });

    const response = await fetch(`/api/submitTrackingDetails`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Error occurred while submitting tracking details");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}
