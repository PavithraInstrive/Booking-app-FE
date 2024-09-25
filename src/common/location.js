import axios from "axios";

const GOOGLE_MAPS_API_KEY = "YOUR_API_KEY"; // Replace with your Google Maps API key

export const fetchDistanceAndDuration = async (startLocation, endLocation) => {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/distancematrix/json`,
      {
        params: {
          origins: startLocation,
          destinations: endLocation,
          key: GOOGLE_MAPS_API_KEY,
        },
      }
    );

    if (response.data.rows[0].elements[0].status === "OK") {
      const distance = response.data.rows[0].elements[0].distance.value; // in meters
      const duration = response.data.rows[0].elements[0].duration.value; // in seconds
      return {
        distance: distance / 1000, // convert to kilometers
        duration: duration / 3600, // convert to hours
      };
    } else {
      throw new Error("Unable to fetch distance and duration.");
    }
  } catch (error) {
    console.error("Error fetching distance and duration:", error);
    throw error;
  }
};
