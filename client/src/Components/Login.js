import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import login_img from './login.jpg'

const Login = (props) => {

  const[credentials,setCredentials]=useState({email:"",password:""})
  let navigate=useNavigate();
  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
  }

  const handleSubmit=async (e)=>{
      e.preventDefault();
      const response = await fetch(`http://localhost:5000/api/auth/login`, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
  
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({email:credentials.email,password:credentials.password})
      });
      const json = await response.json();
      console.log(json);
      if(json.success)
      {
        // Save the auth token and redirect
        localStorage.setItem('token',json.authtoken);
        props.showAlert("Logged In Successfully","success")
        navigate("/");
        
      }
      else{
        props.showAlert("Invalid credentials","danger")
      }
  }

  return (
    <>
    <div className='d-flex justify-content-center' style={{marginTop:'20vh'}}>
    <div className="container mx-5 d-none d-md-block">
    <img src={login_img} alt="Login Image" className="img-fluid mb-3" />
    </div>
    <div className='container mx-5' style={{marginTop:'0%',}}>
      <div className="container" style={{padding:'1vh',borderRadius:'2vh',backgroundColor:'#F0F0F8',width:'70vh'}}>
      <h2 className='my-5' style={{color:'#dc3545'}}>LOGIN</h2>
      <div className="container" >
      <form onSubmit={handleSubmit}>
        <div className="my-4">
          <label htmlFor="email" className="form-label">Email address</label>
          <input type="email" name="email" className="form-control" id="email" aria-describedby="emailHelp" value={credentials.email} onChange={onChange} style={{borderColor:'#FF3444'}}/>
        </div>
        <div className="my-4">
          <label htmlFor="password" className="form-label">Password</label>
          <input type="password" name='password' className="form-control" id="password" value={credentials.password} onChange={onChange} style={{borderColor:'#FF3444'}}/>
        </div>
        <button type="submit" className="btn btn-danger my-4" >Login</button>
        <div className="container my-2">
          Not Signed Up?<Link className="nav-link active" aria-current="page" to="/signup" style={{color:'#FF3444',textDecoration:'underline'}}>Signup</Link>
        </div>
      </form>
      </div>
      </div>
    </div>
    </div>
    </>
  )
}

export default Login
