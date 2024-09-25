import axios from "axios";

const axiosPublicCall = axios.create({
  baseURL: "http://localhost:8080/api/",
});

const axiosPrivateCall = axios.create({
  baseURL: "http://localhost:8080/api/",
});

const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) {
    return null;
  }
  try {
    const response = await axiosPublicCall.post("user/refresh", {
      refreshToken,
    });
    const { accessToken } = response.data;
    localStorage.setItem("token", accessToken);
    console.log(accessToken);
    
    return accessToken;
  } catch (error) {
    console.error("Failed to refresh token", error);
    return null;
  }
};

axiosPrivateCall.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem("token");

    if (token) {
      const base64Url = token.split(".")[1];
      const decodedToken = JSON.parse(window.atob(base64Url));
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
        console.log("Token expired, refreshing...");
        token = await refreshAccessToken();
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        } else {
          useAuthStore.getState().logout();
          return Promise.reject("Token expired and refresh failed");
        }
      } else {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosPrivateCall.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 400 &&
      error.response.data?.message === "Invalid Token"
    ) {
      try {
        const newAccessToken = await refreshAccessToken();
        if (newAccessToken) {
          useAuthStore.getState().updateAccessToken(newAccessToken);
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axiosPrivateCall(originalRequest);
        }
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);
        useAuthStore.getState().logout();
      }
    }
    return Promise.reject(error);
  }
);

const scheduleTokenRenewal = (token) => {
  console.log("Scheduling token renewal");
  
  if (token) {
  let base64Url = token.split(".")[1];
  const decodedToken = JSON.parse(window.atob(base64Url));

  const currentTime = Date.now() / 1000;
  const timeToExpiry = decodedToken.exp - currentTime - 60;

  if (timeToExpiry > 0) {
    setTimeout(async () => {
      const newToken = await refreshAccessToken();
      if (newToken) {
        scheduleTokenRenewal(newToken);
      }
    }, timeToExpiry * 1000);
  }
};
}

const token = localStorage.getItem("token");
scheduleTokenRenewal(token);

export { axiosPublicCall, axiosPrivateCall,refreshAccessToken };
