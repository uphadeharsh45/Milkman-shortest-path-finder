import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import plus from './plus.png'
import saved_routes from './saved_routes.png'
import timeimage from './images.png'
import { useEffect } from 'react'
// import background_image from './background_image.webp'

function Dashboard() {

  const navigate=useNavigate();

  useEffect(() => {
   
        if (localStorage.getItem('token'))
        {
         
        } 
        else {
          console.log("Not logged in. Redirecting to login page...");
          navigate("/login");
         } 
      
  }, []); 
  const handleLogout =()=>{
    localStorage.removeItem('token');
    navigate("/login");
  }

  return (
    <>
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
      <div className='container d-flex justify-content-center align-items-center' style={{ minHeight: '90vh' }}>
        <div className="row justify-content-center gx-5">
          <div className="col-md-4 my-5">
          <Link className="navbar-brand" to="/map">
            <div className="card text-center" style={{boxShadow: '0 0 10px red',border:'0px solid black', borderRadius:'3vh',backgroundColor:'#e4e4e4'}}>
              <div className="card-body">
                <img src={plus} alt="Add Destinations" className="img-fluid mb-3" style={{width:'50%'}} />
                <h5 className="card-title">Add New Routes</h5>
              </div>
            </div>
          </Link>
          </div>
          <div className="col-md-4 my-5">
          <Link className="navbar-brand" to="/showroute">
            <div className="card text-center" style={{boxShadow: '0 0 10px red',border:'0px solid black', borderRadius:'3vh',backgroundColor:'#e4e4e4'}}>
              <div className="card-body">
                <img src={saved_routes} alt="Saved Routes" className="img-fluid mb-3" style={{width:'50%'}} />
                <h5 className="card-title">View Saved Routes</h5>
              </div>
            </div>
          </Link>
          </div>
          <div className="col-md-4 my-5">
          <Link className="navbar-brand" to="/routewithouttime">
            <div className="card text-center" style={{boxShadow: '0 0 10px red',border:'0px solid black', borderRadius:'3vh',backgroundColor:'#e4e4e4'}}>
              <div className="card-body">
                <img src={timeimage} alt="Saved Routes" className="img-fluid mb-3" style={{width:'50%'}} />
                <h5 className="card-title">Add Route Without Time</h5>
              </div>
            </div>
          </Link>
          </div>
        </div>
      </div>
      </div>
    </>
  )
}

export default Dashboard
