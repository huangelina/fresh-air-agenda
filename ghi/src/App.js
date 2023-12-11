
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
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from 'react';
import Nav from './Nav.js'

function App() {
    const domain = /https:\/\/[^/]+/;
    const basename = process.env.PUBLIC_URL.replace(domain, '');

    const { token } = useAuthContext();
    const [ userData, setUserData ] = useState(null);
    const [ events, setEvents ] = useState([]);
    const [ userTimelogs, setTimelogs ] = useState([]);

    const date = new Date();
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;


    async function fetchData() {
        if (token) {
            const tokenUrl = `${process.env.REACT_APP_API_HOST}/token`;
            try {
                const response = await fetch(tokenUrl, {
                    headers: { Authorization: `Bearer ${token}` },
                    credentials: "include",
                });
                if (response.ok) {
                    const data = await response.json();
                    setUserData(data.user);

                    const eventUrl = `${process.env.REACT_APP_API_HOST}/events`;
                    try {
                        const response = await fetch(eventUrl, {
                            headers: { Authorization: `Bearer ${token}` },
                            credentials: "include",
                        });
                        if (response.ok) {
                            const eventData = await response.json();
                            const filteredEvents = eventData.filter(event => event.location === data.user.location);
                            setEvents(filteredEvents);
                        } else {
                            throw new Error('Network response was not ok');
                        }
                    } catch (error) {
                        console.error('Failed to fetching events', error);
                    }

                    const timelogUrl = `${process.env.REACT_APP_API_HOST}/users/${data.user.id}/logs`;
                    try {
                        const response = await fetch(timelogUrl, { headers: { Authorization: `Bearer ${token}` } });
                        if (response.ok) {
                            const timelogs = await response.json();
                            const hasLogForCurrentDate = timelogs.some((timelog) => timelog.date === formattedDate);

                            if (!hasLogForCurrentDate) {
                                createTimelog(data.user);
                            } else {
                                setTimelogs(timelogs);
                            }
                        } else {
                            throw new Error('Network response was not ok');
                        }
                    } catch (error) {
                        console.error('Failed to fetching timelogs', error);
                    }

                } else {
                    throw new Error('Network response was not ok');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        }
    };

    const createTimelog = async (userData) => {
        try {
            const newTimelog = {
                date: formattedDate,
                goal: (userData.goal)/7,
                time_outside: 0,
                user_id: userData.id,

            };
            const url = `${process.env.REACT_APP_API_HOST}/users/${userData.id}/logs/`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(newTimelog),
            });
                if (response.ok) {
                    fetchData();
                } else {
                    console.error('Error creating timelog');
                }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        fetchData();
    // eslint-disable-next-line
    }, [token])


  return (

   <BrowserRouter basename={basename}>
        <Nav userData={userData} />
        <div className="container">
            <Routes>
              <Route exact path="/" element={userData && userTimelogs && events ? <Main token={token} userData={userData} userTimelogs={userTimelogs} events={events} fetchData={fetchData} /> : null}/>
              <Route exact path="/signup" element={<SignupForm />}></Route>
              <Route exact path="/login" element={<LoginForm />}></Route>
              <Route exact path="/users/:id" element = {userData ? <UserDetail token={token} userData={userData} />: null}></Route>
              <Route exact path="/metrics" element={<Metrics token={token} userTimelogs={userTimelogs} />}></Route>
              <Route exact path="/events" element={<EventsList token={token} userData={userData} events={events} fetchData={fetchData} />}></Route>
              <Route exact path="/events/new" element={<EventsForm token={token} userData={userData} fetchData={fetchData} />}></Route>
              <Route exact path="/events/:id/attendance" element={<EventAttendance token={token} userData={userData} />}></Route>
              <Route exact path="/events/:id" element={<EventUpdate token={token} userData={userData} fetchData={fetchData} />}></Route>
          </Routes>
        </div>
    </BrowserRouter>
  );
}

export default App;
