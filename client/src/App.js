import './App.css';
import {
  BrowserRouter,
  Route,
  Routes
} from "react-router-dom";
import Login from './Components/Login';
import Signup from './Components/SignUp';
import Dashboard from './Components/Dashboard';
import Alert from './Components/Alert';
import { useState } from 'react';
import Map from './Components/Map';
import SavedRoutes from './Components/SavedRoutes';

function App() {
  const[alert,setAlert]=useState(null);
  const showAlert=(message,type)=>{
    setAlert({
        msg:message,
        type:type
    })
    setTimeout(()=>{
      setAlert(null);
    },1500);
  }
  return (
    <div className="App">
      <BrowserRouter>
      {/* <Alert alert={alert}/> */}
        <div className="container-1">
          <Routes>
            <Route exact path="/login" element={<Login showAlert={showAlert}/>} />
            <Route exact path="/signup" element={<Signup showAlert={showAlert}/>} />
            <Route exact path="/" element={<Dashboard showAlert={showAlert}/>} />
            <Route exact path="/map" element={<Map showAlert={showAlert}/>} />
            <Route exact path="/savedroutes" element={<SavedRoutes showAlert={showAlert}/>} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
