import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/login';
import Dashboard from './components/dashboard';
import ProjectList from './components/projectlist';
import ProjectCounter from './components/projectcounter';
//import jwtDecode from 'jwt-decode';


const App = () => {
  // const isAuthenticated = () => {
  //   const token = localStorage.getItem('token');
  //   if (!token) return false;
  //   try {
  //     const { exp } = jwtDecode(token);
  //     if (exp < Date.now() / 1000) {
  //       localStorage.removeItem('token');
  //       return false;
  //     }
  //   } catch (e) {
  //     return false;
  //   }
  //   return true;
  // };
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projectlist" element={<ProjectList/>}/>
        <Route path="/projectcounter" element={<ProjectCounter/>}></Route>
        
      </Routes>
    </Router>
  );
};

export default App;
