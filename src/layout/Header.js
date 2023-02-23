import React from 'react'
import header from './img/header.jpg';

function Header() {
  return (
    // This is for display purposes only.
    // The header image is not part of the project.
    <div><img src={header} className="header" alt="header" />  </div>
  )
}

export default Header;  