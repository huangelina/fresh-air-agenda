import { useEffect, useState } from "react";
import { NavLink, Link} from 'react-router-dom';
import { useAuthContext} from "@galvanize-inc/jwtdown-for-react";
import './EventStyle.css';


const EventsList = () => {
    
    const { token } = useAuthContext();
    const [events, setEvents] = useState([]);
    const [userID, setUserID] = useState(null);


    const getEventData = async () => {
        if (token) {
            try {  
                const event_response = await fetch('http://localhost:8000/events', {
                    headers: { Authorization: `Bearer ${token}` },
                    credentials: "include",
                });
                if (event_response.ok) {
                    const eventData = await event_response.json();
                    setEvents(eventData);
                }
                else {
                    throw new Error('Response did not return ok');
                }
            }
            catch (error) {
                console.error('Failed to fetch data', error); 

            }
        }
    }    
    
    const getUserData = async () => {
        if (token) {  
            try {
                const user_response = await fetch('http://localhost:8000/token', {
                    headers: { Authorization: `Bearer ${token}` },
                    credentials: "include",
                })

                if (user_response.ok) {
                    const userData = await user_response.json();

                    setUserID(userData.user.id)

                    const userLocation = (userData.user.location);  
                    const filteredEvents = events.filter((event) => event.location === userLocation);
                    setEvents(filteredEvents);
                }
                else {
                    throw new Error('Response did not return ok');
                }
            }
            catch (error) {
                console.error('Failed to fetch data', error);
            }
        }   
    };

    useEffect(() => {
        getEventData();
        getUserData();

        // eslint-disable-next-line
    }, [token])

    const handleDelete = async (event) => {
        if (token && event.created_by === userID) {
            
            const attendance_response = await fetch(`http://localhost:8000/events/${event.id}/attendance`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });

            if(attendance_response.ok) {
                console.log("attendance successfully deleted for event")
            }
            
            const event_response = await fetch(`http://localhost:8000/events/${event.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });

            if(event_response.ok) {
                getEventData()
                window.alert("Successfully deleted Event!")

            }
            else {
                throw new Error('Response did not return ok');
            }
        }
        else {
            console.error('Unauthorized to delete event');
        }
    }

    const convertTo12Hour = (time) => {
        return new Date(`1970-01-01T${time}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    };

    return (
        <>  
        <center> <h1>Events</h1> </center>
            {events.map(event => (
                <center>
                    <div className="card">
                        <div key={event.id}>
                            <div><img src={event.image_url} alt="default" width="250" height="200"/></div>
                            <div>Name: {event.name}</div>
                            <div>Date: {event.date}</div>
                            <div>Time: {convertTo12Hour(event.time)}</div>
                            <div>Description: {event.description}</div>
                            <div>Location: {event.location}</div>
                            <div>Host: {event.hosted_by}</div>
                            
                            <Link to={`/events/${event.id}/attendance`}>
                                <button disabled={!(token)}>
                                    Attendees
                                </button>
                            </Link>

                            <Link to={`/events/${event.id}`}>
                                <button disabled={!(token && event.created_by === userID)}>
                                    Update
                                </button>
                            </Link>
                            
                            <button 
                            onClick={() => handleDelete(event)}
                            disabled={!(token && event.created_by === userID)}>
                                Delete
                            </button>                               
                        </div>
                    </div>
                </center>
        
            ))}
            <h3>
                <center><NavLink className="btn btn-primary" to="/events/new">Create Event</NavLink></center>
            </h3>
        </>
    )
}

export default EventsList;