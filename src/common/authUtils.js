// authUtils.js
export const logoutUser = (setIsAuthenticated) => {
    localStorage.clear();
    window.location.href = "/";
    setIsAuthenticated(false);
  };
  