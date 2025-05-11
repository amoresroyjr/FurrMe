import React from "react";
import "../components/Footer.css";
import { CgMail } from "react-icons/cg";
import { FaFacebook } from "react-icons/fa";
import { LuInstagram } from "react-icons/lu";
import { FaTiktok } from "react-icons/fa";

function Footer() {
    return (
        <div className="footer">
            <ul className="navList">
                <li>Pet Care Guides</li>
                <li>Pet Adoption Education</li>
                <li>Pet Adoption Process</li>
                <li>Terms and Conditions</li>
                <li>FAQs</li>
            </ul>
            <ul className="navIcons">
                <li>
                    <CgMail />
                </li>
                <li>
                    <FaFacebook />
                </li>
                <li>
                    <LuInstagram />
                </li>
                <li>
                    <FaTiktok />
                </li>
            </ul>
        </div>
    );
}

export default Footer;
