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


    const updateRoute = async (id, newLocations) => {
      try {
        const response = await fetch(`http://localhost:5000/api/routes/updateroute/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('token') // Assuming you're using token-based authentication
          },
          body: JSON.stringify({ newLocations })
        });
    
        const data = await response.json();
    
        if (!response.ok) {
          throw new Error(data.message || 'Failed to update route');
        }
    
        console.log('Route updated successfully:', data.route);
        // return data.route; 
        // Return the updated route data if needed
      } catch (error) {
        console.error('Error updating route:', error);
        // Handle error
      }
    };


    const deleteRoute = async (id) => {
      try {
        const response = await fetch(`http://localhost:5000/api/routes/deleteroute/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('token') 
          }
        });
    
        const data = await response.json();
    
        if (!response.ok) {
          throw new Error(data.message || 'Failed to delete route');
        }
    
        console.log('Route deleted successfully:', data.route);
        // return data.route; 
        // Return the deleted route data if needed
      } catch (error) {
        console.error('Error deleting route:', error);
        // Handle error
      }

      const newRoutes = routes.filter((route) => {
        return route._id !== id;
      })
      setRoutes(newRoutes);
    };




  return (
    <routeContext.Provider value={{ routes, getallroutes,updateRoute,deleteRoute }}>
      {props.children}
    </routeContext.Provider>
  )
}

export default RoutesState
