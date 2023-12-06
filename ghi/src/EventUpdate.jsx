import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuthContext} from "@galvanize-inc/jwtdown-for-react";

const EventUpdate = () => {
    const { token } = useAuthContext();
    const { id } = useParams();
    const [event, setEvent] = useState([]);
    const [userID, setUserID] = useState(null);
    
    const getEventData = async () => {
        if (token) {
            try {  
                const event_response = await fetch(`http://localhost:8000/events/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                    credentials: "include",
                });
                if (event_response.ok) {
                    const eventData = await event_response.json();
                    console.log("list of events ->", eventData);

                    setEvent(eventData);
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
                    console.log("Logged in User's first name ->", userData.user.first);
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

    const handleDataChange = async (e) => {
        e.preventDefault();

        if (token && event.created_by === userID) {
            try {
                const response = await fetch(`http://localhost:8000/events/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(event),
                });

                if (response.ok) {
                    window.alert("Successfully updated Event!")
                    window.location.href = 'http://localhost:3000/events'
                }
                else {
                    throw new Error('Response did not return ok');
                }
            }
            
            catch (error) {
                console.error('Error updating Event:', error);
            }
        }
        else {
            console.error('Unauthorized to update event');
        }

    }

    return (
        <>
        <center> <h1>Update Event</h1> </center>
            {event && (
                <center>
                <form onSubmit={handleDataChange}>
                <div>
                    <label>
                        Event Name:
                        <input
                            type="text"
                            name="name"
                            value={event.name}
                            onChange={(e) => setEvent({ ...event, name: e.target.value })}
                        />
                    </label>
                </div>

                <div>
                    <label>
                        Event Date:
                        <input
                            type="date"
                            name="date"
                            value={event.date}
                            onChange={(e) => setEvent({ ...event, date: e.target.value })}
                        />
                    </label>
                </div>

                <div>
                    <label>
                        Event Time:
                        <input
                            type="time"
                            name="time"
                            value={event.time}
                            onChange={(e) => setEvent({ ...event, time: e.target.value })}
                        />
                    </label>
                </div>

                <div>
                    <label>
                        Event Picture:
                        <input
                            type="text"
                            name="image_url"
                            value={event.image_url}
                            onChange={(e) => setEvent({ ...event, image_url: e.target.value })}
                        />
                    </label>
                </div>

                <div>
                    <label>
                        Event Description:
                        <input
                            type="text"
                            name="description"
                            value={event.description}
                            onChange={(e) => setEvent({ ...event, description: e.target.value })}
                        />
                    </label>
                </div>

                    <br></br>
                    <br></br>

                    <button type="submit">Update Event</button>

                    <br></br>

                    <Link to='/events/'>
                        <button>
                            Return to Events
                        </button>
                    </Link>

                </form>
                </center>
            )}

        </>
    )
}

export default EventUpdate;