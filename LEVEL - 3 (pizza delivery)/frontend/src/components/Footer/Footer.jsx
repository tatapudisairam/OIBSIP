import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <div className='footer' id='footer'>
      <div className="footer-content">
        <div className="footer-content-left">
            <img src={assets.logo} alt="" />
            <p>Browse Our Menu Packed with Delicious Pizzas and More. Our Purpose is to Fulfill Your Cravings and Elevate Your Pizza Dining Experience with Each Bite.</p>
            <div className="footer-social-icons">
                <a href="https://www.facebook.com/tatapudi.sairam.16?mibextid=ZbWKwL" target='_blank'><img src={assets.facebook_icon} alt="" /></a>
                <a href="https://www.instagram.com/tatapudi_sairam/" target='_blank'><img src={assets.instagram_icon} alt="" /></a>
                <a href="https://www.linkedin.com/in/sairam-tatapudi-887b4924b/" target='_blank'><img src={assets.linkedin_icon} alt="" /></a>
            </div>
        </div>
        <div className="footer-content-center">
            <h2>COMPANY</h2>
            <ul>
                <li>Home</li>
                <li>About us</li>
                <a href="#explore-menu"><li>Menu</li></a>
                <li>Delivery</li>
                <li>Privacy policy</li>
            </ul>
        </div>
        <div className="footer-content-right">
            <h2>REACH OUT TO US!</h2>
            <ul>
                <li>+1-123-456-789</li>
                <li>contact@pizza.com</li>
            </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">
        Copyright © 2001-25 - All Right Reserved.
      </p>
    </div>
  )
}

export default Footer
