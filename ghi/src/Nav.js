import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import useToken from "@galvanize-inc/jwtdown-for-react";


function Nav({ userData }) {

    const { logout } = useToken();
    const [isLoggedIn, setisLoggedIn] = useState(false)
    const navigate = useNavigate();


    useEffect(() => {
        if (userData) {
            setisLoggedIn(true);
        }
    }, [userData]);


    function signout() {
        logout();
        navigate("/login");
        window.location.reload();
    }


    return (
        <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#ffffff', boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.1)', borderRadius: '35px', margin: '25px' }}>
            <NavLink className="nav-link ps-3 " to="/">
                <img src="logo-color1.png" alt="" height={50} className="rounded-5 border border-white"></img>
            </NavLink>
                <ul className="navbar-nav mr-auto">
                <li className="nav-item active">
                </li>
                    <li>
                        <NavLink className="nav-link ps-4 " to="/metrics" style={{ fontWeight: 'bold', fontSize: '1em' }}>
                            Metrics
                        </NavLink>
                    </li>
                    <li>
                        <NavLink className="nav-link ps-4" to="/events" style={{ fontWeight: 'bold', fontSize: '1em' }}>
                            Events
                        </NavLink>
                    </li>
                </ul>
            {(isLoggedIn) ? (
            <div className="dropdown pb-4 pe-5 ms-auto">
              <p>Hi {userData.first}</p>
                <NavLink className="d-flex align-items-center text-white text-decoration-none dropdown-toggle nav-link" to={`/users/${userData.id}`} id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
                    <img src={userData.avatar_picture} alt="Profile" width="30" height="30" className="rounded-circle"/>
                    <span className="d-none d-sm-inline mx-1">{userData.first}</span>
                </NavLink>
                <ul className="dropdown-menu dropdown-menu-dark text-small shadow ">
                    <li><NavLink className="dropdown-item nav-link" to={`/users/${userData.id}`}>Profile</NavLink></li>
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
