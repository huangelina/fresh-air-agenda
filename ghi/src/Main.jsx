import React, { useEffect, useState } from 'react';
import { useAuthContext } from "@galvanize-inc/jwtdown-for-react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import OPEN_WEATHER_API_KEY from "./keys.js"

function Main() {
    const { token } = useAuthContext();
    const [userTimelogs, setUserTimelogs ] = useState([]);
    const [currentDate, setCurrentDate] = useState('');
    const [userId, setUserId] = useState();
    const [user, setUser] = useState({});
    const [weather, getWeather] = useState();
    const [events, setEvents] = useState([]);
    const [attendance, setAttendance] = useState([]);


    async function fetchWeather() {
        if (user.location) {
            const url = `http://api.openweathermap.org/geo/1.0/direct?q=${user.location}&limit=1&appid=${OPEN_WEATHER_API_KEY}`
            const response = await fetch(url)
            if (response.ok) {
                const data = await response.json();
                const next_url = `https://api.openweathermap.org/data/2.5/weather?lat=${data[0].lat}&lon=${data[0].lon}&appid=${OPEN_WEATHER_API_KEY}&units=imperial`
                const next_response = await fetch(next_url);
                if (next_response.ok) {
                    const next_data = await next_response.json();
                    getWeather(next_data)
                }
            }
        }
    }


    async function fetchData() {
        if (token && userId) {
            const url = `http://localhost:8000/users/${userId}/logs`;
            const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
            if (response.ok) {
                const timelogs = await response.json();
                const hasLogForCurrentDate = timelogs.some((timelog) => timelog.date === currentDate);

                if (!hasLogForCurrentDate) {
                    createTimelog(userId, user);
                } else {
                    setUserTimelogs(timelogs);
                }
            } else {
                console.error('Error fetching data');
            }
        }
    }


    useEffect(() => {
        async function getUserID(token) {
            if (token) {
                const tokenUrl = 'http://localhost:8000/token';
                const response = await fetch(tokenUrl, {
                    headers: { Authorization: `Bearer ${token}` },
                    credentials: "include",
                });
                if (response.ok) {
                    const data = await response.json();
                    setUserId(data.user.id);
                    setUser(data.user);
                }
            }
        }
        getUserID(token);
    }, [token]);


    useEffect(() => {
        const date = new Date();
        const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
            .toString()
            .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
        setCurrentDate(formattedDate);
    }, []);

    const dateFormat = { month: 'long', day: 'numeric', year: 'numeric' };
    const formattedLongDate = new Date(currentDate).toLocaleDateString(undefined, dateFormat);


    async function fetchEventData() {
        if(token) {
            const url = `http://localhost:8000/events`;
            const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
            if (response.ok) {
                const existingEvents = await response.json();
                setEvents(existingEvents);
            } else {
                console.error('Error fetching event data');
            }
        }
    }


    async function fetchAttendeeData() {
        if(token) {
            const url = `http://localhost:8000/attendance`;
            const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
            if (response.ok) {
                const eventAttendance = await response.json();
                setAttendance(eventAttendance);
            } else {
                console.error('Error fetching attendance data');
            }
        }
    }


    const matchingEventIDs = attendance.filter((item) => item.user_id === userId).map((item) => item.event_id);

    const attendeeEvents = events.filter((event) => matchingEventIDs.includes(event.id));



    useEffect(() => {
        fetchData()
        fetchWeather();
        fetchEventData();
        fetchAttendeeData();
         // eslint-disable-next-line
    }, [userId,user,token]);


    const todaysLog = userTimelogs.find((timelog) => timelog.date === currentDate);


    const createTimelog = async (userId, user) => {
        try {
            const newTimelog = {
                date: currentDate,
                goal: (user.goal)/7,
                time_outside: 0,
                user_id: userId,

            };
            const url = `http://localhost:8000/users/${userId}/logs/`;
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


    const updateTimelog = async (newTimeOutside) => {
        try {
            if (token && userId && todaysLog) {
                const url = `http://localhost:8000/users/${userId}/logs/${todaysLog.id}`;
                const response = await fetch(url, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        ...todaysLog,
                        time_outside: newTimeOutside,
                    }),
                });
                if (response.ok) {
                    fetchData();
                } else {
                    console.error('Error updating log');
                }
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };


    const incrementHour = () => {
        if (todaysLog) {
            const updatedTimeOutside = todaysLog.time_outside + 60;
            updateTimelog(updatedTimeOutside);
        }
    };

    const decrementHour = () => {
    const updatedTimeOutside = todaysLog.time_outside - 60;
    const newTimeOutside = updatedTimeOutside >= 0 ? updatedTimeOutside : 0;
    updateTimelog(newTimeOutside);
    };

    const incrementHalfHour = () => {
        if (todaysLog) {
            const updatedTimeOutside = todaysLog.time_outside + 15;
            updateTimelog(updatedTimeOutside);
        }
    };

    const decrementHalfHour = () => {
    const updatedTimeOutside = todaysLog.time_outside - 15;
    const newTimeOutside = updatedTimeOutside >= 0 ? updatedTimeOutside : 0;
    updateTimelog(newTimeOutside);
    };

    const incrementFiveMinutes = () => {
        if (todaysLog) {
            const updatedTimeOutside = todaysLog.time_outside + 5;
            updateTimelog(updatedTimeOutside);

        }
    };

    const decrementFiveMinutes = () => {
    const updatedTimeOutside = todaysLog.time_outside - 5;
    const newTimeOutside = updatedTimeOutside >= 0 ? updatedTimeOutside : 0;
    updateTimelog(newTimeOutside);
    };

    const totalHours = (todaysLog && todaysLog.time_outside) ? Math.floor(todaysLog.time_outside / 60) : 0;
    const totalRemainingMinutes = (todaysLog && todaysLog.time_outside) ? todaysLog.time_outside % 60 : 0;

    const totalHoursForGoal = (todaysLog && todaysLog.goal) ? Math.floor(todaysLog.goal / 60) : 0;
    const totalRemainingMinutesForGoal = (todaysLog && todaysLog.goal) ? todaysLog.goal % 60 : 0;


    ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
    );


    const totalTimeOutside = (todaysLog && todaysLog.time_outside) ? todaysLog.time_outside / 60 : 0;
    const goal = (user && user.goal) ? user.goal: 0;

    let remainingTime = (totalTimeOutside > goal) ? 0 : goal/7/60 - totalTimeOutside
    if (remainingTime <= 0) {
        remainingTime = 0;
    }

    const data = {
        labels: ['Time spent outside', 'Time remaining'],
        datasets: [{
            label: "hour(s)",
            data: [
                totalTimeOutside,
                remainingTime,
            ],
            backgroundColor: ['#8AFF8A', '#EBEDEF'],
            borderColor: ['white', 'white'],
        }]
    }

    const options = {
        radius: 260,
        cutout: 130,
        plugins: {
            legend: {
                position: 'left',
                align: 'start',
                labels: {
                boxHeight: 18,
                },
            },
        },
    };


    if (user && weather){
        return (
            <>
            <div style={{ marginLeft: '70px', color: '#2E4053', paddingTop: '50px'}}>
                <h1>{user.first}'s FreshAir Agenda</h1>
            </div>
            <div style={{ marginLeft: '70px', marginRight: '70px', marginTop: '35px', marginBottom: '35px'}}>
                <>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '25px' }}>
                        <div style={{ boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.1)', backgroundColor: '#ffffff', padding: '30px', borderRadius: '35px', marginRight: '25px', flex: 2}}>
                            <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>Today is {formattedLongDate}</p>
                            <p style={{ marginBottom: '5px' }}>Your goal is <span style={{ fontWeight: 'bold', fontSize: '1em' }}>{totalHoursForGoal}</span> hr <span style={{ fontWeight: 'bold', fontSize: '1em' }}>{totalRemainingMinutesForGoal}</span> min</p>
                            <p style={{ marginBottom: '5px' }}><span style={{ fontWeight: 'bold', fontSize: '2em' }}>{totalHours}</span> hr <span style={{ fontWeight: 'bold', fontSize: '2em' }}>{totalRemainingMinutes}</span> min spent getting fresh air</p>
                        </div>
                        <div style={{ boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.1)', backgroundColor: '#ffffff', padding: '30px', borderRadius: '35px', marginRight: '25px', flex: 2}}>
                            <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>My events</p>
                            {attendeeEvents.map((event, index) => (
                                <div key={index}>
                                    <p style={{ marginBottom: '5px' }}>{event.date} {event.name}</p>
                                </div>
                            ))}
                        </div>
                        <div style={{ boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.1)', backgroundColor: '#ffffff', padding: '30px', borderRadius: '35px', flex: 1 }}>
                            <p style={{ fontWeight: 'bold', marginBottom: '3px' }}>Weather</p>
                            <p style={{ marginBottom: '1px' }}>{weather.weather[0].description}</p>
                            <p style={{ marginBottom: '1px' }}><span style={{ fontWeight: 'bold', fontSize: '1em' }}>{Math.round(weather.main.temp)}</span> now</p>
                            <p style={{ marginBottom: '1px' }}><span style={{ fontWeight: 'bold', fontSize: '1em' }}>{Math.round(weather.main.temp_max)}</span> high </p>
                            <p style={{ marginBottom: '1px' }}><span style={{ fontWeight: 'bold', fontSize: '1em' }}>{Math.round(weather.main.temp_min)}</span> low</p>
                        </div>
                    </div>
                </>
                    <div style={{ boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.1)', backgroundColor: '#ffffff', padding: '30px', borderRadius: '35px' }}>
                        {todaysLog && (
                            <>
                            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                            <div style={{ width: '700px', height: '700px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Doughnut
                                    data={data}
                                    options={options}
                                ></Doughnut>
                            </div>
                                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', marginLeft: '75px'}}>
                                    <button style={{
                                        margin: '5px',
                                        backgroundColor: '#5adbb5',
                                        border: 'none',
                                        padding: '10px',
                                        borderRadius: '20px'
                                    }}
                                        onClick={incrementHour}>+ 1 hr</button>
                                    <button style={{
                                        margin: '5px',
                                        backgroundColor: '#5adbb5',
                                        border: 'none',
                                        padding: '10px',
                                        borderRadius: '20px'
                                    }} onClick={incrementHalfHour}>+ 15 min</button>
                                    <button style={{
                                        margin: '5px',
                                        backgroundColor: '#5adbb5',
                                        border: 'none',
                                        padding: '10px',
                                        borderRadius: '20px'
                                    }} onClick={incrementFiveMinutes}>+ 5 min</button>
                                    <button style={{
                                        margin: '5px',
                                        backgroundColor: '#EBEDEF',
                                        border: 'none',
                                        padding: '10px',
                                        borderRadius: '20px'
                                    }} onClick={decrementFiveMinutes}>- 5 min</button>
                                    <button style={{
                                        margin: '5px',
                                        backgroundColor: '#EBEDEF',
                                        border: 'none',
                                        padding: '10px',
                                        borderRadius: '20px'
                                    }} onClick={decrementHalfHour}>- 15 min</button>
                                    <button style={{
                                        margin: '5px',
                                        backgroundColor: '#EBEDEF',
                                        border: 'none',
                                        padding: '10px',
                                        borderRadius: '20px'
                                    }} onClick={decrementHour}>- 1 hr</button>
                                </div>
                                </div>
                            </>
                        )}
                    </div>
            </div></>
        );
    }
}

export default Main;
