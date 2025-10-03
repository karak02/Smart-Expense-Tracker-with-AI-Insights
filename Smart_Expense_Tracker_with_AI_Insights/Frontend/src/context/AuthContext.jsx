import React, { Children, createContext,useEffect ,useState} from 'react'
import {gettoken,setToken ,removeToken} from  "../utils/token"

export const AuthContext = createContext();

export const AuthProvider = ({Children}) => {
    const [isAuthenticated,setIsAuthnticated]= useState(false);
    useEffect(()=>{
        if(gettoken()){
             setIsAuthnticated(true)  //user logged in
        } 
    })
    const login = (token)=>{
        setToken (token); //Save the JWT token in localStorage.
        setIsAuthnticated(true)
    }

    const logout = (token) =>{
        removeToken(token)
        setIsAuthnticated(false)
    }

    return (
        <AuthContext.Provider value={{isAuthenticated,login,logout}}> 
            {Children}
        </AuthContext.Provider>
    )
}

