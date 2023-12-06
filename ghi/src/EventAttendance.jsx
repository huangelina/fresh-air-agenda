import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuthContext} from "@galvanize-inc/jwtdown-for-react";



const EventAttendance = () => {
    
    const { token } = useAuthContext();
    const [attendance, setAttendance] = useState([]);
    const { id } = useParams();
    const [userID, setUserID] = useState(null);
    const [userName, setUserName] = useState(null);
    const [event, setEvent] = useState([]);
    const isAttending = attendance.some((attendee) => attendee.user_id === userID);

    const getAttendanceData = async () => {
        if (token) {
            try {
                const response = await fetch('http://localhost:8000/attendance');
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

    const getUserData = async () => {
        if (token) {  
            try {
                const user_response = await fetch('http://localhost:8000/token', {
                    credentials: "include",
                })

                if (user_response.ok) {
                    const userData = await user_response.json();

                    setUserID(userData.user.id);
                    setUserName(userData.user.first + " " + userData.user.last)

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
                const event_response = await fetch(`http://localhost:8000/events/${id}`, {
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
        getUserData();
        getEventData();

        // eslint-disable-next-line
    }, [token])

    const handleAddAttendee = async () => {

        const attendeesData = {
            user_id: userID,
            event_id: id,
            user_name: userName
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
            window.location.reload();
            window.alert("Successfully registered for Event!")
        }

    }

    const handleDelete = async () => {
        const userToDelete = attendance.find(obj => obj.user_id === userID);
        console.log("User to delete", userToDelete)

        if (token && userID === userToDelete.user_id) {
            const response = await fetch(`http://localhost:8000/attendance/${userToDelete.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });

            if(response.ok) {
                getEventData()
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
        <center> <h1>Attendees</h1> 
            {attendance.map(attendee => (     
                <div key={attendee.id}>
                    <div>{attendee.user_name}</div>
                </div>      
        ))}
            <br></br>
            
            <button
                onClick={() => handleAddAttendee()}
                disabled={!(token) || (userID === event.created_by) || isAttending}>
                    {isAttending ? "Attending Event" : "Attend Event"}
            </button>
            
            <br></br>
            
            <button 
                onClick={() => handleDelete()}
                disabled={!(token && isAttending) || event.created_by === userID}>
                    Withdraw from Event
            </button>

            <br></br>
            <br></br>          
        
            <Link to='/events/'>
                <button disabled={!(token)}>
                    Return to Events
                </button>
             </Link>
        </center>
        </>
    )
}

export default EventAttendance;