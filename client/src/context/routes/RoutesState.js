import React from 'react'
import routeContext from "./routeContext";
import { useState } from "react";



const RoutesState = (props) => {
    const host = "http://localhost:5000"
    const routesInitial = []
    const [routes, setRoutes] = useState(routesInitial)

    const getallroutes = async () => {
      const response = await fetch(`${host}/api/routes/fetchallroutes`, {
        method: "GET", // *GET, POST, PUT, DELETE, etc.
  
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem('token')
        }
      });
      const json = await response.json();
    //   console.log(json);
      setRoutes(json);
    };




  return (
    <routeContext.Provider value={{ routes, getallroutes }}>
      {props.children}
    </routeContext.Provider>
  )
}

export default RoutesState
