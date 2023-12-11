import { Link } from 'react-router-dom';


const EventsList = ({ token, userData, events, fetchData }) => {
    let userDataLoading = null;
    
    if (!userData) {
        userDataLoading = true
    }
    else {
        userDataLoading = false
    }

    const handleDelete = async (event) => {
        if (token && event.created_by === userData.id) {
            const confirmDelete = window.confirm('Are you sure you want to delete this event?');
            
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
                    window.alert('Successfully deleted Event!');

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
            window.alert('Only the host can delete their event!')
            return;
        }
    }

    const updateClick = async (event) => {
        if (token && event.created_by === userData.id) {
            window.location.href = `${process.env.PUBLIC_URL}/events/${event.id}`;
        }
        else {
            window.alert('Only the host can update their event!')
            return;
        }
    }

    const convertTo12Hour = (time) => {
        return new Date(`1970-01-01T${time}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    };

    if (userDataLoading === false) {
        return (
            <>
                <div style={{ marginLeft: "70px", color: "#2E4053", paddingTop: "50px"}}>
                    <h1>Events</h1>
                </div>

                <div style={{ marginLeft: "70px", marginRight: "60px", marginTop: "35px", marginBottom: "35px"}}>
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: "25px" }}>
                        <div style={{ boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.1)", backgroundColor: "#ffffff", padding: "30px", borderRadius: "35px", marginRight: "25px", flex: 2}}>
                            <p style={{ fontWeight: "bold", marginBottom: "5px" }}>Currently showing events in: {userData.location}</p>
                            <p style={{ marginBottom: "5px" }}>Click <u>Create Event</u> to host your own event or click <u>Attendees</u> in one of the events down below to attend an existing event!</p>
                            <p style={{ marginBottom: "5px" }}>If you're the host of an event, you may click <u>Update</u> or <u>Delete</u> to make changes to your event!</p>
                            <center>
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
                        </div>
                    </div>
                </div>

                <div className="row justify-content-start" style={{ marginLeft: "56px", marginRight: "72px", marginTop: "35px", marginBottom: "35px"}}>
                    {events.map(event => (
                        <div key={event.id} className="col-4 mb-4">
                            <div className="card" style={{ borderRadius: "30px" }}>
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
}


export default EventsList;
