import React from 'react'
import { useContext } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import routeContext from '../context/routes/routeContext';

const ShowRoute = (props) => {

  const navigate=useNavigate();
  const context = useContext(routeContext);
  const { routes,getallroutes } = context;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (localStorage.getItem('token')) {
          await getallroutes();
        } else {
          console.log("Not logged in. Redirecting to login page...");
          navigate("/login");
        }
      } catch (error) {
        console.error("Error fetching routes:", error);
      }
    };

    fetchData();
  }, []); 

  useEffect(() => {
    console.log(routes);
  }, [routes]);

  return (
    <div>
      
    </div>
  )
}




export default ShowRoute
