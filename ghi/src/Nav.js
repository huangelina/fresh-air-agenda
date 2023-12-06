import { NavLink } from "react-router-dom";
import {useEffect, useState} from 'react';

import useToken from "@galvanize-inc/jwtdown-for-react";


function Nav(userData) {


    const { logout } = useToken();
    const [isLoggedIn, setisLoggedIn] = useState(false)


    useEffect(() => {
  if (userData.userData) {
    setisLoggedIn(true);
  }
}, [userData]);


    function signout() {
        logout();
        window.location.reload();
    }






    return (
        <nav className="navbar navbar-expand-lg" style={{backgroundColor: '#9eadbd'}}>
            <NavLink className="nav-link ps-3 " to="/">
                <img src="logo-color1.png" alt="" height={50} className="rounded-5 border border-white"></img>
            </NavLink>
                <ul className="navbar-nav mr-auto">
                <li className="nav-item active">
                </li>
                    <li>
                        <NavLink className="nav-link ps-4 " to="/metrics">
                            Metrics
                        </NavLink>
                    </li>
                    <li>
                        <NavLink className="nav-link ps-4" to="/events">
                            Events
                        </NavLink>
                    </li>
                </ul>
            {(isLoggedIn) ? (
            <div className="dropdown pb-4 pe-5 ms-auto">
              <p>Hi {userData.userData.first}</p>
                <a href={`${process.env.PUBLIC_URL}/${userData.userData.id}`} className="d-flex align-items-center text-white text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
                    <img src={userData.userData.avatar_picture} alt="Profile" width="30" height="30" className="rounded-circle"/>
                    <span className="d-none d-sm-inline mx-1">{userData.first}</span>
                </a>
                <ul className="dropdown-menu dropdown-menu-dark text-small shadow ">
                    <li><a className="dropdown-item " href={`${process.env.PUBLIC_URL}/users/${userData.userData.id}`}>Profile</a></li>
                    <li>
                        <hr className="dropdown-divider"/>
                    </li>
                    <li><button className="dropdown-item" onClick = {signout} >Sign out</button></li>
                </ul>
            </div>
            ) : (
              <div className="dropdown pb-4 pe-5 ms-auto">
              <p>Hi Friend!</p>
                <a href={`xd`} className="d-flex align-items-center text-white text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
                    <img src="Default_pfp.png" alt="Profile" width="30" height="30" className="rounded-circle"/>
                    <span className="d-none d-sm-inline mx-1"></span>
                </a>
                <ul className="dropdown-menu dropdown-menu-dark text-small shadow">

                    <li><NavLink className="nav-link " to="/login">
                            login
                        </NavLink></li>
                </ul>
            </div>
            )}
        </nav>
    )
}

export default Nav;
