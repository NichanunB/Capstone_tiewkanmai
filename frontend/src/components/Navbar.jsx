import React, { useState } from 'react'
import logo from '../assets/logo.png'
import Button from './ui/Button'
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className='bg-white'>
        <div className='container mx-auto max-w-[1320px] relative h-auto p-10 flex flex-col md:flex-row md:justify-between md:items-center md:h-[80px]'>
            <div className='flex items-center gap-8'>
                <Link to="/">
                    <img className='w-[150px] h-auto' src={logo} alt="" />
                </Link>
                <ul className='hidden md:flex'>
                    <li className='mx-4'><Link to="/">Home</Link></li>
                    <li className='mx-4'><Link to="/">Destination</Link></li>
                    <li className='mx-4'><Link to="/featured">Featured Plan</Link></li>
                </ul>
            </div>

            <ul className='flex flex-col my-5 md:flex-row gap-3'>
                <Link to="/signin">
                    <Button variant="outline">Sign In</Button>
                </Link>
                <Link to="/signup">
                    <Button>Sign Up</Button>
                </Link>  
            </ul>
        </div>
    </nav>
  )
}

export default Navbar