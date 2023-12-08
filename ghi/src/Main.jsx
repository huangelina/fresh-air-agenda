import React, { useEffect, useState } from 'react';
import { useAuthContext } from "@galvanize-inc/jwtdown-for-react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import OPEN_WEATHER_API_KEY from "./keys.js"

function Main({ userData }) {



    // useState variables
    const { token } = useAuthContext();
    const [userTimelogs, setUserTimelogs ] = useState([]);
    const [weather, getWeather] = useState();
    const [events, setEvents] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const [isLoading, setIsLoading] = useState(true);


    // Date
    const date = new Date();
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;




    // Other fetch calls
    async function fetchWeather() {
        if (userData.location) {
            const url = `http://api.openweathermap.org/geo/1.0/direct?q=${userData.location}&limit=1&appid=${OPEN_WEATHER_API_KEY}`
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



    // Time log STUFF!


    async function fetchLogs() {
        if (token && userData.id) {
            const url = `http://localhost:8000/users/${userData.id}/logs`;
            const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
            if (response.ok) {
                const timelogs = await response.json();
                const hasLogForCurrentDate = timelogs.some((timelog) => timelog.date === formattedDate);

                if (!hasLogForCurrentDate) {
                    createTimelog(userData.id, userData);
                } else {
                    setUserTimelogs(timelogs);
                }
            } else {
                console.error('Error fetching data');
            }
        }
    }
    const createTimelog = async (userData) => {
            try {
                const newTimelog = {
                    date: formattedDate,
                    goal: (userData.goal)/7,
                    time_outside: 0,
                    user_id: userData.id,

                };
                const url = `http://localhost:8000/users/${userData.id}/logs/`;
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(newTimelog),
                });
                    if (response.ok) {
                        fetchLogs();
                    } else {
                        console.error('Error creating timelog');
                    }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        const updateTimelog = async (newTimeOutside) => {
        try {
            if (token && userData.id && todaysLog) {
                const url = `http://localhost:8000/users/${userData.id}/logs/${todaysLog.id}`;
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
                    fetchLogs();
                } else {
                    console.error('Error updating log');
                }
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };


     useEffect(() => {
      Promise.all([
          fetchLogs(),
          fetchWeather(),
          fetchEventData(),
          fetchAttendeeData()

      ])
      .then(() => setIsLoading(false))
      .catch(error => console.error('Error:', error));
      // eslint-disable-next-line
  }, [userData, token]);


    const dateParts = formattedDate.split('-');
    const year = dateParts[0];
    const month = dateParts[1];
    const day = dateParts[2];

    const formattedLongDate = `${new Date(year, month - 1, day).toLocaleString('default', { month: 'long' })} ${parseInt(day, 10)}, ${year}`;
    const todaysLog = userTimelogs.find((timelog) => timelog.date === formattedDate);
    const matchingEventIDs = attendance.filter((item) => item.user_id === userData.id).map((item) => item.event_id);
    const attendeeEvents = events.filter((event) => matchingEventIDs.includes(event.id));
    const totalHours = (todaysLog && todaysLog.time_outside) ? Math.floor(todaysLog.time_outside / 60) : 0;
    const totalRemainingMinutes = (todaysLog && todaysLog.time_outside) ? todaysLog.time_outside % 60 : 0;
    const totalHoursForGoal = (todaysLog && todaysLog.goal) ? Math.floor(todaysLog.goal / 60) : 0;
    const totalRemainingMinutesForGoal = (todaysLog && todaysLog.goal) ? todaysLog.goal % 60 : 0;
    const totalTimeOutside = (todaysLog && todaysLog.time_outside) ? todaysLog.time_outside / 60 : 0;
    const goal = (userData && userData.goal) ? userData.goal: 0;

    function timeChange(time) {
        if (todaysLog) {
            const updatedTimeOutside = todaysLog.time_outside + time
            updateTimelog(updatedTimeOutside)
        }
    }




    ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
    );




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


    if (isLoading === false && todaysLog){
        return (
            <>
            <div style={{ marginLeft: '70px', color: '#2E4053', paddingTop: '50px'}}>
                <h1>{userData.first}'s FreshAir Agenda</h1>
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
                                        onClick={() => timeChange(60)}>+ 1 hr</button>
                                    <button style={{
                                        margin: '5px',
                                        backgroundColor: '#5adbb5',
                                        border: 'none',
                                        padding: '10px',
                                        borderRadius: '20px'
                                    }} onClick={() => timeChange(15)}>+ 15 min</button>
                                    <button style={{
                                        margin: '5px',
                                        backgroundColor: '#5adbb5',
                                        border: 'none',
                                        padding: '10px',
                                        borderRadius: '20px'
                                    }} onClick={() => timeChange(5)}>+ 5 min</button>
                                    <button style={{
                                        margin: '5px',
                                        backgroundColor: '#EBEDEF',
                                        border: 'none',
                                        padding: '10px',
                                        borderRadius: '20px'
                                    }} onClick={() => timeChange(-5)}>- 5 min</button>
                                    <button style={{
                                        margin: '5px',
                                        backgroundColor: '#EBEDEF',
                                        border: 'none',
                                        padding: '10px',
                                        borderRadius: '20px'
                                    }} onClick={() => timeChange(-15)}>- 15 min</button>
                                    <button style={{
                                        margin: '5px',
                                        backgroundColor: '#EBEDEF',
                                        border: 'none',
                                        padding: '10px',
                                        borderRadius: '20px'
                                    }} onClick={() => timeChange(-60)}>- 1 hr</button>
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
