import React from 'react'
import { Link } from 'react-router-dom'
/*import './index.sass'*/

export default function() {
  return <>
    <li className='navbar__menu-item'>
      <Link to={`/home`}>Home</Link>
    </li>
    <li className='navbar__menu-item'>
      <Link to={`/register`}>Register</Link>
    </li>
    <li className='navbar__menu-item'>
      <Link to={`/users`}>Users</Link>
    </li>
    <li className='navbar__menu-item'>
      <Link to={`/`}>Logout</Link>
    </li>
  </>
}