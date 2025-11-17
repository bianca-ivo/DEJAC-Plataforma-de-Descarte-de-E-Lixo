import React from 'react';
import ReactDOM from 'react-dom/client';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import App from './App';
import HomePage from './components/Home';
import User from './User';
import GlobalStyle from "./styles/global";

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Router>
    <Routes> 
      <Route exact path="/" element={<HomePage />} />
      <Route path="/usuario" element={<User />} />
      <Route path="/administrador" element={<App />} />
    </Routes> 
    <GlobalStyle />
  </Router>
);
