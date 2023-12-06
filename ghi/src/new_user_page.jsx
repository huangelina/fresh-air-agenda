import { useParams } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import { useAuthContext } from "@galvanize-inc/jwtdown-for-react";

const NewUserDetail = () => {
   const { token } = useAuthContext();
   const [user, setUser] = useState({
       firstName: "",
       lastName: "",
       email: "",
       username: "",
       password: "",
       location: "",
       picture: "",
       goal: "",
       bio: "",
   });
   const [isEditable, setisEditable] = useState(false);
   const [isUser, setisUser] = useState(false);
   const [error, setError] = useState(null);
   const { id } = useParams();

   const fetchData = useCallback(async () => {
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
               } else {
                  throw new Error('Network response was not ok');
               }
           } catch (error) {
               console.error('Error fetching data:', error);
               setError(error);
           }
       }
   }, [id, token]);

   const fetchID = useCallback(async () => {
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
               setError(error);
           }
       }
   }, [id, token]);

   useEffect(() => {
       fetchData();
       fetchID();
   }, [fetchData, fetchID]);

   const handleDataChange = async (e) => {
       e.preventDefault();
       const accountData = {
           ...user,
           first: user.firstName,
           last: user.lastName,
           email: user.email,
           username: user.username,
           password: user.password,
           location: user.location,
           goal: user.goal,
           avatar_picture: user.picture,
           bio: user.bio,
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
           setUser({...user, ...accountData});
       }
   }


    if (user){

    return (
    <div>
    {isEditable === false && (

    <div className="card" style={{ width: '18rem' }}>
        <img src={user.avatar_picture} className="card-img-top" alt="..."/>
        <div className="card-body">
            <h5 className="card-title">Hello {user.first}</h5>
            <p className="card-text">{user.bio}</p>
        </div>
         <ul className="list-group list-group-flush">
            <li className="list-group-item">{user.first}{user.last}</li>
            <li className="list-group-item">{user.location}</li>
            <li className="list-group-item">{user.goal}</li>
        </ul>
        {/* <div className="card-body">
        <a href="#" className="card-link">Card link</a>
        <a href="#" className="card-link">Another link</a>
        </div> */}

    {/* <div>
      <img src = {user.avatar_picture} alt="" />
      <div>{user.first}</div>
      <div>{user.last}</div>
      <div>{user.email}</div>
      <div>{user.location}</div>
      <div>{user.goal/60}</div>
      <div>{user.bio}</div> */}
      {isUser &&(
      <button onClick={() => setisEditable(!isEditable)}>Edit</button>
          )}
    </div>
      )}
    {isEditable === true &&(

                  <div className="card text-bg-light mb-3">
                      <h5 className="card-header">Hello {user.firstName}</h5>
                      <div className="card-body">
                          <form onSubmit={(e) => handleDataChange(e)}>
                              <div className="mb-3">
                                 <input
                                     name="firstname"
                                     type="text"
                                     className="form-control"
                                     defaultValue={user.first}
                                     onChange={(e) => {
                                         setUser({...user, firstName: e.target.value});
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
                                         setUser({...user, lastName: e.target.value});
                                     }}
                                 />
                              </div>
                              <div className="mb-3">
                                 <input
                                     name="email"
                                     type="text"
                                     className="form-control"
                                     defaultValue={user.email}
                                     onChange={(e) => {
                                         setUser({...user, email: e.target.value});
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
                                         setUser({...user, username: e.target.value});
                                     }}
                                 />
                              </div>
                              <div className="mb-3">
                                 <input
                                     name="password"
                                     type="password"
                                     className="form-control"
                                     defaultValue={user.password}
                                     onChange={(e) => {
                                         setUser({...user, password: e.target.value});
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
                                         setUser({...user, location: e.target.value});
                                     }}
                                 />
                              </div>
                              <div className="mb-3">
                                 <input
                                     name="picture"
                                     type="text"
                                     className="form-control"
                                     defaultValue={user.avatar_picture}
                                     onChange={(e) => {
                                         setUser({...user, picture: e.target.value});
                                     }}
                                 />
                              </div>
                              <div className="mb-3">
                                 <input
                                     name="goal"
                                     type="text"
                                     className="form-control"
                                     defaultValue={user.goal}
                                     onChange={(e) => {
                                         setUser({...user, goal: e.target.value});
                                     }}
                                 />
                              </div>
                              <div className="mb-3">
                                 <input
                                     name="bio"
                                     type="text"
                                     className="form-control"
                                     defaultValue={user.bio}
                                     onChange={(e) => {
                                         setUser({...user, bio: e.target.value});
                                     }}
                                 />
                              </div>
                              {/* ...similarly for other fields... */}
                              <div>
                                 <input className="btn btn-primary" type="submit" value="Update" />
                              </div>
                              <button onClick={() => setisEditable(!isEditable)}>Cancel</button>
                          </form>
                      </div>
                  </div>
               )}
           </div>
       );
   }
   return null; // or a loading state
}

export default NewUserDetail;
