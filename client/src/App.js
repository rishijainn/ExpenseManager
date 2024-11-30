import './App.css';
import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';


function App() {

  const [isLoggedIn,setIsLoggedIn]= useState(false);
  return (
    <div >

      <Routes>
      
      <Route path='/'element={<SignUp/>}/>
      <Route path='/login'element={<Login isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>}/>
      
      <Route path='/dashboard'element={<Dashboard isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>}/>

      
        
      </Routes>
      <ToastContainer/>
      
    </div>
  );
}

export default App;
