// Save JWT token (localStorage is the simplest option)
export const saveToken = (token) => {
  localStorage.setItem("authToken", token);
};

// Get token
export const getToken = () => {
  return localStorage.getItem("authToken");
};

// Remove token (for logout)
export const removeToken = () => {
  localStorage.removeItem("authToken");
};

// Optional: check if logged in
export const isLoggedIn = () => {
  return !!getToken();
};
export const setUserIdentity = (role) => {
  localStorage.setItem("role",role)
}

export const getUserIdentity= ()=> {
return  localStorage.getItem("role")
}



