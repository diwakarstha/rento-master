import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/images/rento-resize-2.png";
import auth from "./../../services/authService";

const Footer = ({ userType }) => {
  const user = auth.getCurrentUser();
  return (
    <footer>
      <hr />
      <div className="mt-3">
        <div className="d-flex m-auto justify-content-center">
          <Link to="/">
            <img id="rento-logo" src={logo} alt="Rento" />
          </Link>
        </div>
        <div className="mt-3">
          <div className="d-flex m-auto justify-content-center">
            <a className="rento-text nav-link" href="www.facebook.com">
              <i className="fa fa-facebook-square d-flex fa-2x"></i>
            </a>
            <a className="rento-text nav-link" href="www.twitter.com">
              <i className="fa fa-twitter fa-2x"></i>
            </a>
            <a className="rento-text nav-link" href="www.instagram.com">
              <i className="fa fa-instagram d-flex fa-2x"></i>
            </a>
          </div>
        </div>
        {!userType && (
          <div className="mt-3">
            <ul
              className="d-lg-flex d-md-flex d-sm-flex m-auto justify-content-center text-center pr-5"
              style={{ listStyleType: "none" }}
            >
              <li className="mx-2">
                <a className="text-secondary" href="/">
                  Home
                </a>
              </li>
              <li className="mx-2">
                <a className="text-secondary" href="/rooms">
                  Find Room
                </a>
              </li>
              {!user && (
                <li className=" mx-2">
                  <a className="text-secondary" href="/RoomOwner/MyRooms">
                    List Room
                  </a>
                </li>
              )}
              <li className="mx-2">
                <a className="text-secondary" href="/about">
                  About
                </a>
              </li>
              <li className="mx-2">
                <a className="text-secondary" href="/contacts">
                  Contacts
                </a>
              </li>
            </ul>
          </div>
        )}
        <hr />
        <div>
          <p
            className="d-flex justify-content-center mb-3"
            style={{ fontSize: 12 }}
          >
            © 2020 Copyright: Rento
            <br />
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
