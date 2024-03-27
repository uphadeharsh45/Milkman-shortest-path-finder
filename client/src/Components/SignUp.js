import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import signup_img from './signup.png'

const SignUp = (props) => {
  document.body.style.backgroundColor='black';
  const [credentials, setCredentials] = useState({ name: "", email: "", password: "", cpassword: "" })
  let navigate = useNavigate();
  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password } = credentials
    const response = await fetch(`http://localhost:5000/api/auth/createuser`, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.

      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password })
    });
    const json = await response.json();
    console.log(json);
    if (json.success) {
      // Save the auth token and redirect
      localStorage.setItem('token', json.authtoken);
      navigate("/");
      props.showAlert("Registered Successfully", "success")
    }
    else {
      props.showAlert("Invalid credentials", "danger")
    }
  }

  return (
    <div>
      <div className='d-flex justify-content-center' style={{ marginTop: '20vh' }}>
        <div className="container mx-5 d-none d-md-block">
          <img src={signup_img} alt="Login Image" className="img-fluid mb-3" />
        </div>
        <div className='container mx-5' style={{marginTop:'0%',}}>
        <div className="container" style={{padding:'1vh',borderRadius:'2vh',width:'70vh',boxShadow: '0 0 20px #dc3545',backgroundColor:'#1f1c1c'}}>
        <h2 className='my-4' style={{ color: '#dc3545' }}>SIGNUP</h2>
        <div className="container">
        <form onSubmit={handleSubmit}>
          <div className="my-4">
            <label htmlFor="name" className="form-label" style={{color:'white'}}>Name</label>
            <input type="text" name="name" className="form-control" id="name" aria-describedby="emailHelp" onChange={onChange} style={{borderColor:'#FF3444'}} />
          </div>
          <div className="my-4">
            <label htmlFor="email" className="form-label" style={{color:'white'}}>Email address</label>
            <input type="email" name="email" className="form-control" id="email" aria-describedby="emailHelp" onChange={onChange} style={{borderColor:'#FF3444'}}/>
          </div>
          <div className="my-4">
            <label htmlFor="password" className="form-label" style={{color:'white'}}>Password</label>
            <input type="password" name="password" className="form-control" id="password" onChange={onChange} required minLength={5} style={{borderColor:'#FF3444'}}/>
          </div>
          <div className="my-4">
            <label htmlFor="cpassword" className="form-label" style={{color:'white'}}>Confirm Password</label>
            <input type="password" name="cpassword" className="form-control" id="cpassword" onChange={onChange} required minLength={5} style={{borderColor:'#FF3444'}}/>
          </div>
          <button type="submit" className="btn btn-danger my-3">Signup</button>
          <div className="container my-1" style={{color:'white'}}>
          Already Signed Up?<Link className="nav-link active" aria-current="page" to="/login" style={{color:'#FF3444',textDecoration:'underline'}}>Login</Link>
        </div>
        </form>
        </div>
        </div>
        </div>
      </div>
    </div>
  )
}

export default SignUp
