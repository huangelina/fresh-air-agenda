import "./App.css";
import SignupForm from "./SignupForm.jsx"
import LoginForm from "./LoginForm.jsx"
import Main from "./Main.jsx"
import Metrics from "./Metrics.jsx";
import UserDetail from "./UserPage.jsx";
import EventsList from "./EventsList.jsx"
import EventsForm from "./EventsForm.jsx"
import EventAttendance from "./EventAttendance.jsx"
import EventUpdate from "./EventUpdate.jsx"
import { useAuthContext } from "@galvanize-inc/jwtdown-for-react";
import { BrowserRouter, Routes, Route} from "react-router-dom";
import {useEffect, useState} from 'react';
import Nav from './Nav.js'



function App() {

    const domain = /https:\/\/[^/]+/;
    const basename = process.env.PUBLIC_URL.replace(domain, '');


    const { token } = useAuthContext();
    const [userData, setUserData] = useState(null);



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

          } else {
            throw new Error('Network response was not ok');
          }
        } catch (error) {
          console.error('Error fetching ID:', error);
        }

      }
    };

    fetchUser();

  }, [token]);



  return (

   <BrowserRouter basename={basename}>
        <Nav userData= { userData } />
        <div className="container">
            <Routes>
                <Route exact path="/" element={userData ? <Main userData= {userData}/> : null}/>
                <Route exact path="/signup" element={<SignupForm />}></Route>
                <Route exact path="/login" element={<LoginForm />}></Route>
                <Route exact path="/users/:id" element = { userData? <UserDetail userData = {userData} />: null}></Route>
                <Route exact path="/metrics" element={<Metrics />}></Route>
                <Route exact path="/events" element={<EventsList />}></Route>
            <Route exact path="/events/new" element={<EventsForm />}></Route>
            <Route exact path="/events/:id/attendance" element={<EventAttendance />}></Route>
            <Route exact path="/events/:id" element={<EventUpdate />}></Route>
          </Routes>
        </div>

    </BrowserRouter>
  );
}

export default App;
