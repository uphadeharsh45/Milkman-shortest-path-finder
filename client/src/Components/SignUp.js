import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const SignUp = (props) => {

  const[credentials,setCredentials]=useState({name: "",email:"",password:"",cpassword:""})
  let navigate=useNavigate();
  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
  }

  const handleSubmit=async (e)=>{
      e.preventDefault();
     const {name,email,password}=credentials
      const response = await fetch(`http://localhost:5000/api/auth/createuser`, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
  
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({name,email,password})
      });
      const json = await response.json();
      console.log(json);
      if(json.success)
      {
        // Save the auth token and redirect
        localStorage.setItem('token',json.authtoken);
        navigate("/");
        props.showAlert("Registered Successfully","success")
      }
      else{
        props.showAlert("Invalid credentials","danger")
      }
  }

  return (
    <div>
      <h2>Create an account to use iNotebook</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name"  className="form-label">Name :</label>
          <input type="text" name="name" className="form-control" id="name" aria-describedby="emailHelp" onChange={onChange} />
          
        </div>
        <div className="mb-3">
          <label htmlFor="email"  className="form-label">Email address :</label>
          <input type="email" name="email" className="form-control" id="email" aria-describedby="emailHelp" onChange={onChange} />
          <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
        </div>
        <div className="mb-3">
          <label htmlFor="password"  className="form-label">Password</label>
          <input type="password" name="password" className="form-control" id="password" onChange={onChange} required minLength={5} />
        </div>
        <div className="mb-3">
          <label htmlFor="cpassword"  className="form-label">Confirm Password</label>
          <input type="password" name="cpassword" className="form-control" id="cpassword" onChange={onChange} required minLength={5} />
        </div>

        <button type="submit" className="btn btn-primary">SignUp</button>
      </form>
    </div>
  )
}

export default SignUp
