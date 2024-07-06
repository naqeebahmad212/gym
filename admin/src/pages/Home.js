import React from 'react'
import Navbar from '../components/Navbar'
import Header from '../components/Header'
import FindJim from '../components/FindJim'
import ContactSection from '../components/ContactSection'
import Hero from '../components/Hero'
import Footer from '../components/Footer'
import Feature from '../components/Feature'

const Home = () => {
  return (
    <>
      <Header/>
      <Hero/>
      <Feature/>
      <ContactSection background={"#0a0a0a"}/>
    </>
  )
}

export default Home
