import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

const EventUpdate = ({ token, userData, fetchData }) => {
    const { id } = useParams();
    const [event, setEvent] = useState({
        name: '',
        date: '',
        time: '',
        image_url: '',
        description: '',
    });
    const navigate = useNavigate();

    const getEventData = async () => {
        if (token) {
            try {
                const event_response = await fetch(`${process.env.REACT_APP_API_HOST}/events/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                    credentials: 'include',
                });
                if (event_response.ok) {
                    const eventData = await event_response.json();
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


    useEffect(() => {
        getEventData();
        // eslint-disable-next-line
    }, [token])

    const handleDataChange = async (e) => {
        e.preventDefault();

        if (token && event.created_by === userData.id) {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_HOST}/events/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(event),
                });

                if (response.ok) {
                    fetchData();
                    window.alert('Successfully updated Event!')
                    navigate("/events")
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
        <br></br>
        <center> <h1>Update Event</h1>

        <br></br>

        <div className="card text-bg-dark mb-3" style={{ width: "45rem"}}>
            <div className="card-body">
            {event && (
                <form onSubmit={handleDataChange}>
                <div className="mb-3">
                    <input
                        className="form-control"
                        type="text"
                        name="name"
                        value={event.name}
                        onChange={(e) => setEvent({ ...event, name: e.target.value })}
                    />
                </div>

                <div className="mb-3">
                    <input
                        className="form-control"
                        type="date"
                        name="date"
                        value={event.date}
                        onChange={(e) => setEvent({ ...event, date: e.target.value })}
                    />
                </div>

                <div className="mb-3">
                    <input
                        className="form-control"
                        type="time"
                        name="time"
                        value={event.time}
                        onChange={(e) => setEvent({ ...event, time: e.target.value })}
                    />
                </div>

                <div className="mb-3">
                    <input
                        className="form-control"
                        type="text"
                        name="image_url"
                        value={event.image_url}
                        onChange={(e) => setEvent({ ...event, image_url: e.target.value })}
                    />
                </div>

                <div className="mb-3">
                    <textarea
                        className="form-control"
                        type="text"
                        name="description"
                        value={event.description}
                        onChange={(e) => setEvent({ ...event, description: e.target.value })}
                    />
                </div>

                <button className="btn btn-danger mb-2" type="submit">Update</button>

                <br></br>

                <Link to='/events/'>
                    <button className="mx-1">
                        Return to Events
                    </button>
                </Link>

                </form>
            )}
            </div>
            </div>
        </center>
        </>
    )
}

export default EventUpdate;
