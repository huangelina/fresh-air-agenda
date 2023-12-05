import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import { useAuthContext} from "@galvanize-inc/jwtdown-for-react";
import './EventStyle.css';

const EventsForm = () => {
    const { token } = useAuthContext();
    const [userLocation, setUserLocation] = useState([]);
    const [hostUser, setHostUser] = useState([]);
    const [hostID, setHostID] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        date: '',
        time: '',
        image_url: '',
        description: '',
        location: '',
        created_by: '',
        hosted_by: ''
    })

    const getData = async () => {
        if (token) {
            try {
                const user_response = await fetch('http://localhost:8000/token', {
                    credentials: "include",
                })
                if (user_response.ok) {
                    const userData = await user_response.json();
                    console.log(userData)

                    const userLocation = (userData.user.location);
                    setUserLocation(userLocation)

                    const userID = (userData.user.id);
                    setHostID(userID)

                    const userName = (userData.user.first + " " + userData.user.last);
                    console.log("user's name ->", userName);
                    setHostUser(userName)
                }
                else {
                    throw new Error('Response did not return ok');
                }
            }
            catch (error) {
                console.error('Failed to fetch data', error)
            }
        }
    }

    useEffect(() => {
        getData()

        // eslint-disable-next-line
    }, [token]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const bodyData = {
            ...formData,
            image_url: formData.image_url.trim() !== '' ? formData.image_url : undefined,
        }
        
        const event_response = await fetch(`http://localhost:8000/events`, {
            method: "POST",
            body: JSON.stringify(bodyData),
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
        });
        
        const created_event = await event_response.json();
        
        const eventID = created_event.id;
        const attendeesData = {
            user_id: hostID,
            event_id: eventID,
            user_name: hostUser
        };
        
        const attendees_response = await fetch(`http://localhost:8000/attendance`, {
            method: "POST",
            body: JSON.stringify(attendeesData),
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
        });

        if (attendees_response.ok) {
            console.log("host attendee successfully added")
        }

        if (event_response.ok) {
            setFormData({
                name: '',
                date: '',
                time: '',
                image_url: '',
                description: '',
                location: '',
                created_by: '',
                hosted_by: ''
            })
        }
        else {
            throw new Error('Response did not return ok');
        }

    }

    const handleFormChange = (e) => {
        const value = e.target.value;
        const inputName = e.target.name;
        setFormData({
            ...formData,
            [inputName]: value,
            location: userLocation,
            created_by: hostID,
            hosted_by: hostUser,
        });
    }

    return (
        <>
              <center><h1>Create An Event</h1></center>
              <center><form onSubmit={handleSubmit} id="create-event-form">
                {/* Name */}
                <div>
                    <input 
                        onChange={handleFormChange} 
                        value={formData.name} 
                        placeholder="Event name" 
                        required type="text" 
                        name="name" 
                        id="name" />
                </div>

                {/* Date */}
                <div>
                    <input 
                        onChange={handleFormChange} 
                        value={formData.date} 
                        placeholder="Date (0000-00-00)" 
                        required type="text" 
                        name="date" 
                        id="date" />
                </div>

                {/* Time */}
                <div>
                    <input 
                        onChange={handleFormChange} 
                        value={formData.time} 
                        placeholder="Time (00:00:00)" 
                        required type="text" 
                        name="time" 
                        id="time" />
                </div>

                {/* Image_URL */}
                <div>
                    <input 
                        onChange={handleFormChange} 
                        value={formData.image_url} 
                        placeholder="Image URL (optional)" 
                        required type="text" 
                        name="image_url" 
                        id="image_url" />
                        
                </div>

                {/* Description */}
                <div>
                    <input 
                        onChange={handleFormChange} 
                        value={formData.description} 
                        placeholder="Description (optional)" 
                        required type="text" 
                        name="description" 
                        id="description" />
                </div>

                {/* Location */}

                {/* Hosted By */}

                <br></br>

                <button>
                    Create
                </button>

                <br></br>
                <br></br>
                
                <Link to='/events/'>
                    <button>
                        Return to Events
                    </button>
                </Link>
                
              </form></center>
        </>
    );
}
export default EventsForm;