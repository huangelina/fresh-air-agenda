import "./App.css";
import SignupForm from "./SignupForm.jsx"
import LoginForm from "./LoginForm.jsx"
import Main from "./Main.jsx"
import UserDetail from "./UserPage.jsx";
import { useAuthContext } from "@galvanize-inc/jwtdown-for-react";
import useToken from "@galvanize-inc/jwtdown-for-react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NavLink } from "react-router-dom";
import {useEffect, useState} from 'react';


function App() {

    const domain = /https:\/\/[^/]+/;
    const basename = process.env.PUBLIC_URL.replace(domain, '');


    const { token } = useAuthContext();
    const { logout } = useToken();
    const [userData, setUserData] = useState("");


    useEffect(() => {

        const fetchUser = async () => {
        if (token) {
            const url = 'http://localhost:8000/token';
            try {
                const response = await fetch(url, {
                    headers: { Authorization: `Bearer ${token}` },
                    credentials: "include",
                });

                if (response.ok) {
                    const data = await response.json();


                    setUserData(data.user);
                    }
                 else {
                    throw new Error('Network response was not ok');
                }
            } catch (error) {
                console.error('Error fetching ID:', error);

        }}
    }; fetchUser()}, [token])

  return (

   <BrowserRouter basename={basename}>
          <div className="container-fluid"/>
            <div className="row flex-nowrap">
                <div className="col-auto col-md-3 col-xl-1 px-sm-2 px-0 bg-dark">
                    <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
                        <a href="/" >
                            <img src = "logo-color.png" alt = "" height = {100} width = {100} className="rounded-3 img-fluid" />
                        </a>
                            <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
                                <li>
                                    <NavLink className="nav-link " to="/metrics">
                                        Metrics
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink className="nav-link " to="/login">
                                        login
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink className="nav-link " to="/signup">
                                        signup
                                    </NavLink>
                                </li>
                                <li>
                                    Hi {userData.first}
                                </li>

                                {/* <li>
                                    <a href="#" className="nav-link px-0 align-middle">
                                        <i className="fs-4 bi-table"></i> <span className="ms-1 d-none d-sm-inline">Events</span></a>
                                </li> */}

                            </ul>
                            <hr/>
                        <div className="dropdown pb-4">
                            <a href={`http://localhost:3000/users/${userData.id}`} className="d-flex align-items-center text-white text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
                                <img src={userData.avatar_picture} alt="avatar_picture" width="30" height="30" className="rounded-circle"/>
                                <span className="d-none d-sm-inline mx-1">{userData.first}</span>
                            </a>
                            <ul className="dropdown-menu dropdown-menu-dark text-small shadow">
                                <li><a className="dropdown-item" href={`http://localhost:3000/users/${userData.id}`}>Profile</a></li>
                                <li>
                                    <hr className="dropdown-divider"/>
                                </li>
                                 <li><button className="dropdown-item" onClick={logout}>Sign out</button></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="col py-3"/>
                <Routes>
                    <Route exact path="/" element={<Main />}></Route>
                    <Route exact path="/signup" element={<SignupForm />}></Route>
                    <Route exact path="/login" element={<LoginForm />}></Route>
                    <Route exact path="/users/:id" element = {<UserDetail />}></Route>
                </Routes>
                </div>

            </BrowserRouter>

  );
}

export default App;
