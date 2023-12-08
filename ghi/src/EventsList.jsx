import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { useAuthContext} from "@galvanize-inc/jwtdown-for-react";


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
                    
                    console.log(eventData)
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

            if (attendance_response.ok) {
                window.alert("Removed attendees!")
            } 
            
            const event_response = await fetch(`http://localhost:8000/events/${event.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });

            if (event_response.ok) {
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
            <center><h1>Events</h1>
                {token ? (
                    <Link to="/events/new">
                        <button className="btn btn-primary">
                            Create Event
                        </button>
                    </Link>
                ) : (
                    <button className="btn btn-primary" disabled>
                        Create Event
                    </button>
                )}
            </center>
            
            <div className="row">
                {events.map(event => (
                    <div key={event.id} className="col-md-4 mb-4">
                        <div className="card" style={{ width: "23rem" }}>
                            <center><img className="card-img-top" src={event.image_url} alt="Event Pic" /></center>
                            <div className="card-body">
                                <h5 className="card-title"><b>{event.name}</b></h5>
                                <p className="card-text">Description: {event.description}</p>
                                <p className="card-text">Date: {event.date}</p>
                                <p className="card-text">Time: {convertTo12Hour(event.time)}</p>
                                <p className="card-text">Location: {event.location}</p>
                                <p className="card-text">Host: {event.hosted_by}</p>
                            <center>
                                <Link to={`/events/${event.id}/attendance`}>
                                    <button
                                        className="btn btn-info m-1" 
                                        disabled={!token}>
                                            Attendees
                                    </button>
                                </Link>

                                {token && event.created_by === userID ? (
                                    <Link to={`/events/${event.id}`}>
                                        <button className="btn btn-success m-1">
                                            Update
                                        </button>
                                    </Link>
                                ) : (
                                    <button className="btn btn-success m-1" disabled>
                                        Update
                                    </button>
                                )}

                                <button
                                    onClick={() => handleDelete(event)}
                                    className="btn btn-danger m-1"
                                    disabled={!(token && event.created_by === userID)}>
                                    Delete
                                </button>
                            </center>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

export default EventsList;