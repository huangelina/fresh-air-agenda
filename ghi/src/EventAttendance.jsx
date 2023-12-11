import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

const EventAttendance = ({ token, userData }) => {

    const [attendance, setAttendance] = useState([]);
    const { id } = useParams();
    const [event, setEvent] = useState([]);
    const navigate = useNavigate();

    let userDataLoading = null;

    if (!userData) {
        userDataLoading = true
    }
    else {
        userDataLoading = false
    }


    const getAttendanceData = async () => {
        if (token) {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_HOST}/attendance`);
                if (response.ok) {
                    const attendanceList = await response.json();

                    const filteredAttendance = attendanceList.filter((attendee) => attendee.event_id === parseInt(id));
                    setAttendance((filteredAttendance));

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
        getAttendanceData();
        getEventData();

        // eslint-disable-next-line
    }, [token])

    const handleAddAttendee = async () => {

        if (event.created_by === userData.id || attendance.some((attendee) => attendee.user_id === userData.id)) {
            window.alert('You are already registered for this event!');
            return;
        }
        const attendeesData = {
            user_id: userData.id,
            event_id: id,
            user_name: `${userData.first} ${userData.last}`
        };

        const attendees_response = await fetch(`${process.env.REACT_APP_API_HOST}/attendance`, {
            method: "POST",
            body: JSON.stringify(attendeesData),
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
        });

        if (attendees_response.ok) {
            window.alert('Successfully registered for Event!')
            navigate('/events')
        }

    }

    const handleDelete = async () => {
        const userToDelete = attendance.find(obj => obj.user_id === userData.id);

        if (event.created_by === userData.id) {
            window.alert('Host cannot withdraw from event! You may delete the event from the event page if necessary.');
            return;
        }
        else if (!(attendance.some((attendee) => attendee.user_id === userData.id))) {
            window.alert('Cannot withdraw from an event you are not registered for!')
            return;
        }

        if (token && userData.id === userToDelete.user_id) {
            const response = await fetch(`${process.env.REACT_APP_API_HOST}/attendance/${userToDelete.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });

            if(response.ok) {
                window.alert('Successfully withdrew from Event!')
                navigate("/events")
            }
            else {
                throw new Error('Response did not return ok');
            }
        }
        else {
            console.error('Unauthorized to delete event');
        }
    }

    if (userDataLoading === false) {
        return (
            <>
                <center>
                    <h1>Attendees</h1>
                </center>
                    <br></br>

                <div style={{ marginLeft: "70px", marginRight: "60px", marginBottom: "35px"}}>
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: "25px" }}>
                        <div style={{ boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.1)", backgroundColor: "#ffffff", padding: "30px", borderRadius: "35px", marginRight: "25px", flex: 2}}>
                            <p style={{ fontWeight: "bold", marginBottom: "5px" }}>This is a list of all of the attendees for the event: {event.name}</p>
                            <p style={{ marginBottom: "5px" }}>The host of the event is always the first attendee of the event. </p>
                            <p style={{ marginBottom: "5px" }}>Click <u>Register</u> to attend the event or <u>Withdraw</u> to remove your participation from the event!</p>
                            <p style={{ marginBottom: "5px" }}>Click on the icon next to the attendee's name to view their profile!</p>
                        </div>
                    </div>
                </div>

                <div style={{ justifyContent: "center", marginLeft: "300px", marginRight: "300px"}}>
                    <ol className="list-group list-group-numbered" style={{fontSize: "20px"}}>
                        {attendance.map(attendee => (
                            <li key={attendee.id} className="list-group-item" style={{ borderColor: "#000000"   , display: "flex" }}>
                                <Link to={`/users/${attendee.user_id}`}>
                                    <img
                                        src="https://cdn2.iconfinder.com/data/icons/instagram-outline/19/11-512.png"  // Assuming userData.avatar is the URL of the avatar image
                                        alt={`Avatar of ${attendee.user_name}`}
                                        style={{ width: '40px', height: '40px', marginRight: '10px', borderRadius: '50%' }}
                                    />
                                </Link>
                                <span key={attendee.id} style={{fontSize: "20px"}}>
                                    {attendee.user_name}
                                </span>
                            </li>
                        ))}
                    </ol>
                    </div>
                    <br></br>
                    <center>
                        <button
                            onClick={() => handleAddAttendee()}
                            className="btn btn-danger m-1">
                            Register
                        </button>

                        <button
                            onClick={() => handleDelete()}
                            className="btn btn-secondary m-1">
                            Withdraw
                        </button>

                        <br></br>

                        <Link to='/events/'>
                            <button
                                className="mt-2"
                                disabled={!(token)}>
                                Return to Events
                            </button>
                        </Link>
                    </center>
            </>
        )
    }
}

export default EventAttendance;
