import './App.css';
import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes} from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import {Spinner} from './components/Spinner';

// Lazy-loaded components with improved naming conventions
const Home = lazy(() => import('./pages/Home'));
const Gym = lazy(() => import('./pages/Gym'));
const GymDetail = lazy(() => import('./pages/GymDetail'));
const Contact = lazy(() => import('./pages/Contact'));
const Register = lazy(() => import('./pages/Register')); // Assuming 'Reister' was a typo
const Login = lazy(() => import('./pages/Login'));
const RegisterIntoJim = lazy(() => import('./pages/RegisterIntoJim'));

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Suspense fallback={<Spinner/>}> 
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Gym" element={<Gym />} />
            <Route path="/Details" element={<GymDetail />} />
            <Route path="/Contact-us" element={<Contact />} />
            <Route path="/Register" element={<Register />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/RegisterIntoJim" element={<RegisterIntoJim />} />
          </Routes>
        </Suspense>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
