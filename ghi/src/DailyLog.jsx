import React, { useEffect, useState } from 'react';
import { useAuthContext } from "@galvanize-inc/jwtdown-for-react";


function DailyLog() {
    const { token } = useAuthContext();
    const [userTimelogs, setUserTimelogs ] = useState([]);
    const [currentDate, setCurrentDate] = useState('');
    const [userId, setUserId] = useState();
    const [user, setUser] = useState({});


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

    // get user.id and user from token
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

    // format the date
    useEffect(() => {
        const date = new Date();
        const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
            .toString()
            .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
        setCurrentDate(formattedDate);
    }, []);

    // fetch data after user data loads from token
    useEffect(() => {
        fetchData();
    }, [userId]);

    const todaysLog = userTimelogs.find((timelog) => timelog.date === currentDate);

    // create timelog for new user or new day
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

    // update timelog in database when 'time spent outside' changes
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
            const updatedTimeOutside = todaysLog.time_outside + 30;
            updateTimelog(updatedTimeOutside);
        }
    };

    const decrementHalfHour = () => {
    const updatedTimeOutside = todaysLog.time_outside - 30;
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

    return (
        <><h1>Daily Log</h1>
        <div>
             <p>Current Date: {currentDate}</p>
                <div>
                    {todaysLog && (
                        <div key={todaysLog.id} className="timelog-item">
                            <p>timelog ID: {todaysLog.id}</p>
                            <p>goal: {todaysLog.goal}</p>
                            <p>time spent outside: {(todaysLog.time_outside)/60}</p>
                            <button onClick={incrementHour}>+ 1 hr</button>
                            <button onClick={decrementHour}>- 1 hr</button>
                            <button onClick={incrementHalfHour}>+ 30 min</button>
                            <button onClick={decrementHalfHour}>- 30 min</button>
                            <button onClick={incrementFiveMinutes}>+ 5 min</button>
                            <button onClick={decrementFiveMinutes}>- 5 min</button>
                        </div>
                    )}
                </div>
        </div></>
    );
}


export default DailyLog;
