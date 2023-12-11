import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';


const EventsForm = ({ token, userData, fetchData }) => {
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
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const bodyData = {
            ...formData,
            image_url: formData.image_url.trim() !== '' ? formData.image_url : 'https://cdn.vectorstock.com/i/preview-1x/65/30/default-image-icon-missing-picture-page-vector-40546530.jpg',
        }

        const event_response = await fetch(`${process.env.REACT_APP_API_HOST}/events`, {
            method: 'POST',
            body: JSON.stringify(bodyData),
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
        });
        fetchData();

        const created_event = await event_response.json();

        const eventID = created_event.id;
        const attendeesData = {
            user_id: userData.id,
            event_id: eventID,
            user_name: `${userData.first} ${userData.last}`
        };

        const attendees_response = await fetch(`${process.env.REACT_APP_API_HOST}/attendance`, {
            method: 'POST',
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
            window.alert('Successfully created Event!')
            navigate("/events")
        }
        else {
            throw new Error('Response did not return ok');
        }

    };

    const handleFormChange = (e) => {
        const value = e.target.value;
        const inputName = e.target.name;

        if (inputName === 'time') {
            const timeArray = value.split(':');
            let hours = parseInt(timeArray[0]);
            const minutes = timeArray[1];
            let period;

            if (value.includes('AM')) {
                period = 'AM';
            }
            else if (value.includes('PM')) {
                period = 'PM';
            }

            if (hours < 10) {
                hours = `0${hours}`;
            }

            if (period === 'PM' && hours !== 12) {
                hours += 12;
            }
            else if (period === 'AM' && hours === 12) {
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
                location: userData.location,
                created_by: userData.id,
                hosted_by: `${userData.first} ${userData.last}`,
            });
        }
    };

    return (
        <>
        <br></br>
        <center>
        <h1> Create Event </h1>

        <div className="card text-bg-dark mb-3" style={{ width: "45rem"}}>
            <div className="card-body">
                <form onSubmit={handleSubmit}>
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

                <button className="btn btn-danger mb-2" type="submit">
                    Create
                </button>

                <br></br>

                <Link to='/events/'>
                    <button className="btn btn-secondary">
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
