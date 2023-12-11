import { Link } from 'react-router-dom';

const EventsList = ({ token, userData, events, fetchData }) => {
    const handleDelete = async (event) => {
        if (token && event.created_by === userData.id) {
            const confirmDelete = window.confirm("Are you sure you want to delete this event?");
            
            if (confirmDelete) {
                await fetch(`${process.env.REACT_APP_API_HOST}/events/${event.id}/attendance`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                });

                const event_response = await fetch(`${process.env.REACT_APP_API_HOST}/events/${event.id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                });

                if (event_response.ok) {
                    fetchData()  // fetchData() App.js
                    window.alert("Successfully deleted Event!");

                }
                else {
                    throw new Error('Response did not return ok');
                }
            }
            else {
                return;
            }
        }
        else {
            window.alert("Only the host can delete their event!")
            return;
        }
    }

    const updateClick = async (event) => {
        if (token && event.created_by === userData.id) {
            window.location.href = `${process.env.PUBLIC_URL}/events/${event.id}`;
        }
        else {
            window.alert("Only the host can update their event!")
            return;
        }
    }

    const convertTo12Hour = (time) => {
        return new Date(`1970-01-01T${time}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    };

    return (
        <>
            <center>
                <h1>Events</h1>
                {token ? (
                    <Link to="/events/new">
                        <button 
                            className="btn btn-primary border border-dark m-3">
                                Create Event
                        </button>
                    </Link>
                ) : (
                    <button 
                        className="btn btn-primary border border-dark m-3" disabled>
                            Create Event
                    </button>
                )}
            </center>

            <div className="row justify-content-start">
                {events.map(event => (
                    <div key={event.id} className="col-4 mb-4">
                        <div className="card border border-dark" style={{ borderRadius: "30px" }}>
                            <center><img className="card-img-top" src={event.image_url} alt="Event Pic" style={{ borderTopLeftRadius: "30px", borderTopRightRadius: "30px"}} /></center>
                            <div className="card-body">
                                <center><h4 className="card-title"><b>{event.name}</b></h4></center>
                                <p className="card-text">Description: {event.description}</p>
                                <p className="card-text">Date: {event.date}</p>
                                <p className="card-text">Time: {convertTo12Hour(event.time)}</p>
                                <p className="card-text">Location: {event.location}</p>
                                <p className="card-text">Host: {event.hosted_by}</p>
                            <center>
                                <Link to={`/events/${event.id}/attendance`}>
                                    <button
                                        className="btn border border-dark m-1"
                                        style={{backgroundColor: "#9adbac"}}
                                        disabled={!token}>
                                            Attendees
                                    </button>
                                </Link>
    
                                <button
                                    onClick={() => updateClick(event)}
                                    className="btn btn-danger border border-dark m-1"
                                    style={{backgroundColor: "#ff526c"}}>
                                        Update
                                </button>

                                <button
                                    onClick={() => handleDelete(event)}
                                    className="btn btn-secondary border border-dark m-1">
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
