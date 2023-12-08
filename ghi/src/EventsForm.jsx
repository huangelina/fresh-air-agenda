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

                    const userLocation = (userData.user.location);
                    setUserLocation(userLocation)

                    const userID = (userData.user.id);
                    setHostID(userID)

                    const userName = (userData.user.first + " " + userData.user.last);
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
            image_url: formData.image_url.trim() !== '' ? formData.image_url : '',
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
            window.alert("Successfully created Event!")
        }
        else {
            throw new Error('Response did not return ok');
        }

    };

    const handleFormChange = (e) => {
        const value = e.target.value;
        const inputName = e.target.name;

        if (inputName === "time") {
            const timeArray = value.split(':');
            let hours = parseInt(timeArray[0]);
            const minutes = timeArray[1];
            let period;

            if (value.includes("AM")) {
                period = "AM";
            } 
            else if (value.includes("PM")) {
                period = "PM";
            }

            if (hours < 10) {
                hours = `0${hours}`;
            }

            if (period === "PM" && hours !== 12) {
                hours += 12;
            }
            else if (period === "AM" && hours === 12) {
                hours = 0;
            }
            
            setFormData({
                ...formData,
                time: `${hours}:${minutes}:00`,
            });
        }

        else {
            setFormData({
                ...formData,
                [inputName]: value,
                location: userLocation,
                created_by: hostID,
                hosted_by: hostUser,
            });
        }
    };

    return (
        <>
        <br></br>
        <center>
        <h2> Create Event </h2>  
        <div className="card text-bg-light mb-3" style={{ width: "25rem" }}>
            <div className="card-body">
                <form onSubmit={handleSubmit} id="create-event-form">
                <div className="mb-3">
                    <input  
                        className="form-control"
                        placeholder="Event Name"
                        required 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleFormChange} 
                    />
                </div>

                <div className="mb-3">
                    <input
                        className="form-control" 
                        placeholder="Date" 
                        required 
                        type="date" 
                        name="date"
                        value={formData.date}
                        onChange={handleFormChange} 
                    />
                </div>

                <div className="mb-3">
                    <input  
                        className="form-control"
                        placeholder="Time"
                        required 
                        type="time" 
                        name="time"
                        value={formData.time}
                        onChange={handleFormChange} 
                    />
                </div>

                <div className="mb-3">
                    <input
                        className="form-control"
                        placeholder="Picture URL (optional)" 
                        type="text" 
                        name="image_url"
                        value={formData.image_url}
                        onChange={handleFormChange}
                    />
                </div>

                <div className="mb-3">
                    <textarea
                        className="form-control"
                        placeholder="Description"
                        required 
                        type="text" 
                        name="description"
                        value={formData.description}
                        onChange={handleFormChange}
                    /> 
                </div>

                <button className="btn btn-success mb-2" type="submit">
                    Create
                </button>

                <br></br>
                
                <Link to='/events/'>
                    <button className="btn btn-primary">
                        Return to Events
                    </button>
                </Link>
                </form>
            </div>
            </div>
            </center>
        </>
    );
}
export default EventsForm;