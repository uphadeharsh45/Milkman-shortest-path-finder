import React from 'react'
import { useContext } from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import routeContext from '../context/routes/routeContext';
import ShowonMap from './ShowonMap';

const ShowRoute = () => {

  const navigate = useNavigate();
  const context = useContext(routeContext);
  const { routes, getallroutes } = context;

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

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate("/login");
  }

  const showroute=(index)=>{
    console.log(index.locations);
  }

  return (
    <div>
      <div>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">Uphade Routes</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link className="nav-link active" aria-current="page" to="/">Home</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/about">About</Link>
                </li>
              </ul>
              <form className="d-flex" role="search" onSubmit={(e) => e.preventDefault()}>
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                  <li className="nav-item">
                    {/* <Link className='btn btn-danger mx-2' to='/login' role='button' onClick={handleLogout}>Logout</Link> */}
                    <button className='btn btn-danger mx-2' onClick={handleLogout}>Logout</button>
                  </li>
                </ul>
              </form>
            </div>
          </div>
        </nav>
      </div>
      <h1 className='my-3'>Saved Routes</h1>
      <div className="container" style={{ padding: '2vw' }}>
        {routes.map((index, arrayindex) => (
          <div style={{padding:'1vw'}}>
            <h3>{`Route ${arrayindex + 1}`}<i className="fa-solid fa-trash mx-5"></i><button className="btn btn-danger" type="submit" onClick={(index)=>{showroute(index)}}>Show Route</button></h3>
            <table className='table table-bordered table-dark' id={index} >
              <thead>
                <tr>
                  <th style={{ width: '2vw' }}></th>
                  <th style={{ width: '2vw' }}></th>
                  <th>Name</th>
                  <th>Time</th>
                </tr>
              </thead>
              {index.locations.map((place) => (
                <tbody>
                  <tr>
                    <td className='table-sm'><i className="fa-solid fa-trash mx-2"></i></td>
                    <td ><i className="fa-solid fa-pen mx-2"></i></td>
                    <td >{place.name}</td>
                    <td >{place.time}</td>
                  </tr>
                </tbody>
              ))}
            </table>
          </div>
        ))}
      </div>
    </div>
  )
}




export default ShowRoute
