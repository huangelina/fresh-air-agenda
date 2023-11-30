import {useParams} from 'react-router-dom';
import {useEffect, useState} from 'react';
import { useAuthContext } from "@galvanize-inc/jwtdown-for-react";


const UserDetail = () => {

    const { token } = useAuthContext();
    const [user, setUser] = useState();
    const { id } = useParams()
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [location, setLocation] = useState("");
    const [picture, setPicture] = useState("")
    const [goal, setGoal] = useState("")
    const [bio, setBio] = useState("")
    const [isEditable, setisEditable] = useState(false)
    const [isUser, setisUser] = useState(false)




   useEffect(() => {
    const fetchData = async () => {
        if (token) {
            const url = `http://localhost:8000/users/${id}`;
            try {
                const response = await fetch(url, {
                    headers: { Authorization: `Bearer ${token}` },
                    credentials: "include",
                });

                if (response.ok) {
                    const data = await response.json();
                    setUser(data);
                    setFirstName(data.first);
                    setLastName(data.last);
                    setEmail(data.email);
                    setUsername(data.username);
                    setLocation(data.location);
                    setPicture(data.avatar_picture);
                    setGoal(data.goal);
                    setBio(data.bio);
                } else {
                    throw new Error('Network response was not ok');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
    };

    const fetchID = async () => {
        if (token) {
            const url = 'http://localhost:8000/token';
            try {
                const response = await fetch(url, {
                    headers: { Authorization: `Bearer ${token}` },
                    credentials: "include",
                });

                if (response.ok) {
                    const data = await response.json();

                    if (data.user.id === parseInt(id)) {
                        setisUser(true);
                    }
                } else {
                    throw new Error('Network response was not ok');
                }
            } catch (error) {
                console.error('Error fetching ID:', error);
            }
        }
    };

    fetchData();
    fetchID();
}, [id, token]);

    const handleDataChange = async (e) => {
    e.preventDefault();
    const accountData = {
      first: firstName,
      last: lastName,
      email: email,
      username: username,
      password: password,
      location: location,
      goal: goal,
      avatar_picture: picture,
      bio: bio

    };

      const response = await fetch(
        `http://localhost:8000/users/${id}`,
        {
          method: "PUT",
          credentials: "include",
          body: JSON.stringify(accountData),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
        }
      );

      if (response.ok) {
        window.location.reload()
      }




    }

    if (user){

    return (
    <div>
    {isEditable === false && (
    <div>
      <img src = {user.avatar_picture} alt="" />
      <div>{user.first}</div>
      <div>{user.last}</div>
      <div>{user.email}</div>
      <div>{user.location}</div>
      <div>{user.goal/60}</div>
      <div>{user.bio}</div>
      {isUser &&(
      <button onClick={() => setisEditable(!isEditable)}>Edit</button>
          )}
    </div>
      )}
    {isEditable === true &&(
    <div className="card text-bg-light mb-3">
      <h5 className="card-header">Hello {user.first}</h5>
      <div className="card-body">
        <form onSubmit={(e) => handleDataChange(e)}>

          <div className="mb-3">

            <input
              name="firstname"
              type="text"
              className="form-control"
              defaultValue={user.first}
              onChange={(e) => {
                setFirstName(e.target.value);
              }}
            />
          </div>
          <div className="mb-3">
            <input
              name="lastname"
              type="text"
              className="form-control"
              defaultValue={user.last}
              onChange={(e) => {
                setLastName(e.target.value);
              }}
            />
          </div>
          <div className="mb-3">
            <input
              name="email"
              type="email"
              className="form-control"
             defaultValue={user.email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </div>
          <div className="mb-3">
            <input
              name="username"
              type="text"
              className="form-control"
              defaultValue={user.username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
          </div>
          <div className="mb-3">
            <input
              name="password"
              type="password"
              className="form-control"
              placeholder="password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>
          <div className="mb-3">
            <input
              name="location"
              type="text"
              className="form-control"
              defaultValue={user.location}
              onChange={(e) => {
                setLocation(e.target.value);
              }}
            />
          </div>
          <div className="mb-3">
            <input
              name="avatar_picture"
              type="text"
              className="form-control"
              placeholder="Profile Picture"
              defaultValue={user.avatar_picture}
              onChange={(e) => {
                setPicture(e.target.value);
              }}
            />
          </div>
          <div className="mb-3">
            <input
              name="bio"
              type="text"
              className="form-control"
              placeholder="Tell us about yourself!"
              defaultValue={user.bio}
              onChange={(e) => {
                setBio(e.target.value);
              }}
            />
          </div>
           <div className="mb-3">
            <input
              name="goal"
              type="text"
              className="form-control"
              placeholder="what's your weekly goal"
              defaultValue={user.goal/60}
              onChange={(e) => {
                setGoal(e.target.value * 60);
              }}
            />
          </div>

          <div>
            <input className="btn btn-primary" type="submit" value="Update" />
          </div>

          <button  onClick={() => setisEditable(!isEditable)}>Cancel</button>

        </form>
      </div>
    </div>
    )}
    </div>
  );
};

    }




export default UserDetail;
