import React, { useCallback, useEffect } from "react";
import { useState } from "react";
let logoutTimer;
const AuthContext = React.createContext({
  token: "",
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
});
const calculateRemainingTime =(expirationTime)=>{
  const currentTime = new Date().getTime();
  const adjustedTime = new Date(expirationTime).getTime();
  const remainingDuration =adjustedTime - currentTime;
  return remainingDuration;
}
const retrieveStoredToken =()=>{
  const storedToken = localStorage.getItem('token');
  const storedExpirationTime =localStorage.getItem('expirationTime');
  const remainingTime = calculateRemainingTime(storedExpirationTime);
  if(remainingTime<=3600){
    localStorage.removeItem('token');
    localStorage.removeItem('expirationTime');
    return null;
  }
  return{
    token:storedToken,
    duration:remainingTime
  }
}
//we will use this method in Index.js file
export const AuthContextProvider = (props) => {
  const tokenData=retrieveStoredToken();
 let initialState;
 //tokenData use to set 
  if(tokenData){
    initialState = tokenData.token;
  }
  const [token, setToken] = useState(initialState);
  const userIsLoggedIn = !!token; //if the string will be empty it will be a false boolean if it has something inside the string it will show true;
 
  const logoutHandler = useCallback(() => {
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('expirationTime')
    if(logoutTimer){
      clearTimeout(logoutTimer)
    }

  },[]);
  //in this login handler  we have use setTimeout and some other expirations to set timeout
   const loginHandler = (token,expirationTime) => {
    setToken(token);
    localStorage.setItem('token',token);
    localStorage.setItem('expirationTime' ,expirationTime)
    const remainingTime =calculateRemainingTime(expirationTime);
    logoutTimer=setTimeout(logoutHandler,remainingTime)
  };
  useEffect(()=>{
    if(tokenData){
      console.log(tokenData.duration);
      logoutTimer=setTimeout(logoutHandler,tokenData.duration) 
    }
  },[tokenData,logoutHandler]);
  const contextValue = {

    token: token,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };
  return (
    <AuthContext.Provider value={contextValue}>
      {" "}
      {props.children}
    </AuthContext.Provider>
  );
};
export default AuthContext;
//we will import this in AuthForm 

