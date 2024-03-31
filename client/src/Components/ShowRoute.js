import React from 'react'
import { useContext } from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import routeContext from '../context/routes/routeContext';


const ShowRoute = (props) => {

  const navigate = useNavigate();
  const context = useContext(routeContext);
  const { routes, getallroutes,updateRoute,deleteRoute,deleteCustomer,updateTime } = context;
  const [routeIdtoUpdate,setRouteIdtoUpdate]=useState('');
  const [custIdtoUpdate,setCustIdtoUpdate]=useState('');
  const [newTime,setNewTime]=useState('');

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

  const handleEditCustomer=()=>{
    updateTime(routeIdtoUpdate,custIdtoUpdate,newTime);
    setNewTime('');
    props.showAlert("Deadline updated successfully !","success")
  }

  // const showroute=(index)=>{
  //   console.log(index.locations);
  // }

  const showroute = (id, locations) => {
    navigate("/showonmap", { state: { id, locations } });
  }

  

  return (
    <div>
      <div>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">RouteMaster</Link>
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
      <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Update Customer Deadline</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form>
                {/* <div className="mb-3">
                  <label htmlFor="recipient-name" className="col-form-label">Name:</label>
                  <input type="text" className="form-control" id="recipient-name" style={{ backgroundColor: '#e4e4e4', border: '1px solid black' }} />
                </div> */}
                <div className="mb-3">
                  <label htmlFor="message-text" className="col-form-label">Time:</label><br />
                  <input type="time" name="add_time" id="add_time"
                    style={{
                      padding: '6px 7px',
                      fontSize: '15px',
                      margin: '0px',
                      borderRadius: '7px',
                      backgroundColor: '#e4e4e4',
                      color: 'black',
                      cursor: 'pointer'
                    }} value={newTime} onChange={(e) => setNewTime(e.target.value)}  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={handleEditCustomer}>Update Deadline</button>
            </div>
          </div>
        </div>
      </div>
      <h1 className='my-3'>Saved Routes</h1>
      <div className="container" style={{ padding: '2vw' }}>
        {routes.map((index, arrayindex) => (
          <div style={{padding:'1vw'}}>
            <h3>{`Route ${arrayindex + 1}`}<i className="fa-solid fa-trash mx-5" onClick={()=>{deleteRoute(index._id);props.showAlert("Route deleted successfully !","success")}}></i><button className="btn btn-danger" type="submit" onClick={() => showroute(index._id, index.locations)}>Show Route</button></h3>
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
                    <td className='table-sm'><i className="fa-solid fa-trash mx-2" onClick={()=>{deleteCustomer(index._id,place._id);props.showAlert("Customer Deleted successfully !","success")}}></i></td>
                    <td ><i className="fa-solid fa-pen mx-2" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={()=>{setCustIdtoUpdate(place._id);setRouteIdtoUpdate(index._id)}} ></i></td>
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
