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


    const deleteCustomer = async (routeId, customerId) => {
      try {
        const response = await fetch(`http://localhost:5000/api/routes/deletecustomer/${routeId}/${customerId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('token') // Assuming you're using token-based authentication
          }
        });
    
        const data = await response.json();
    
        if (!response.ok) {
          throw new Error(data.message || 'Failed to delete customer');
        }

           // Update the frontend state to reflect the changes
     setRoutes(prevRoutes => {
      const updatedRoutes = prevRoutes.map(route => {
        if (route._id === routeId) {
          // Filter out the deleted customer from the locations array
          route.locations = route.locations.filter(customer => customer._id !== customerId);
        }
        return route;
      });
      return updatedRoutes;
    });
    
        console.log('Customer deleted successfully');
        // Return any necessary data or handle success
      } catch (error) {
        console.error('Error deleting customer:', error);
        // Handle error
      }
    };

    const updateTime = async (routeId,customerId, newTime) => {
      try {
        const response = await fetch(`http://localhost:5000/api/routes/updatetime/${routeId}/${customerId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('token')
          },
          body: JSON.stringify({ newTime })
        });
    
        const data = await response.json();
    
        if (response.ok) {

        } else {
          console.error('Failed to update time:', data.message);
        }
      } catch (error) {
        console.error('Error updating time:', error);
      }
    };



  return (
    <routeContext.Provider value={{ routes, getallroutes,updateRoute,deleteRoute,deleteCustomer,updateTime }}>
      {props.children}
    </routeContext.Provider>
  )
}

export default RoutesState
