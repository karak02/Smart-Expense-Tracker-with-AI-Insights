export const setToken = (token)=>{  
    localStorage.setItem("token",token)  // Save token after login
}

export const getToken = () =>{
    return localStorage.getItem("token")  // Get token when making API calls
}

export const removeToken = () => {
    localStorage.removeItem("token")  // Remove token on logout
}