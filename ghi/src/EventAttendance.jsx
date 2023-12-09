import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";



const EventAttendance = ({ token, userData }) => {

    const [attendance, setAttendance] = useState([]);
    const { id } = useParams();
    const [event, setEvent] = useState([]);
    const isAttending = attendance.some((attendee) => attendee.user_id === userData.id);

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
                    credentials: "include",
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
            window.location.reload();
            window.alert("Successfully registered for Event!")
        }

    }

    const handleDelete = async () => {
        const userToDelete = attendance.find(obj => obj.user_id === userData.id);

        if (token && userData.id === userToDelete.user_id) {
            const response = await fetch(`${process.env.REACT_APP_API_HOST}/attendance/${userToDelete.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });

            if(response.ok) {
                window.alert("Successfully withdrew from Event!")
                window.location.reload();
            }
            else {
                throw new Error('Response did not return ok');
            }
        }
        else {
            console.error('Unauthorized to delete event');
        }
    }


    return (
        <>
        <center>
            <h1>Attendees</h1>
            <br></br>
            <ol className="list-group" style={{ maxWidth:'500px'}}>
                {attendance.map(attendee => (
                    <div key={attendee.id}>
                    <Link to={`/users/${attendee.user_id}`}>
                        <button
                            type="button"
                            className="list-group-item list-group-item-action list-group-item-success"
                            style={{ borderColor: '#000000'}}
                            key={attendee.id}>
                                {attendee.user_name}
                        </button>
                    </Link>
                    </div>
            ))}
            </ol>
            <br></br>

            <button
                onClick={() => handleAddAttendee()}
                className="btn btn-info m-1"
                disabled={!(token) || (userData.id === event.created_by) || isAttending}>
                    {isAttending ? "Registered" : "Register"}
            </button>

            <button
                onClick={() => handleDelete()}
                className="btn btn-info m-1"
                disabled={!(token && isAttending) || event.created_by === userData.id}>
                    Withdraw
            </button>

            <br></br>
            <br></br>

            <Link to='/events/'>
                <button
                    disabled={!(token)}>
                    Return to Events
                </button>
            </Link>
        </center>
        </>
    )
}

export default EventAttendance;
