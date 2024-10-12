export async function submitTrackingDetails({
  formattedGoals,
  trackerId,
}: {
  formattedGoals: {
    actionId: number;
    actionValue: string;
    isNotApplicable: boolean;
  }[];
  trackerId: number;
}) {
  try {
    const formData = new FormData();
    formData.append("actionValueDTOsJson", JSON.stringify(formattedGoals));
    formData.append("trackerId", trackerId.toString());

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
