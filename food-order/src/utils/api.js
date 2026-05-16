const API_URL = "yahyatarek.ddns.net:4000/api";

export const fetchWithAuth = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });
  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch (err) {
    if (!response.ok) {
      throw new Error(
        `Server Error (${response.status}): Endpoint might not exist or server needs a restart.`,
      );
    }
    throw new Error("Invalid response from server");
  }

  if (!response.ok) {
    throw new Error(data.msg || "Something went wrong");
  }

  return data;
};
