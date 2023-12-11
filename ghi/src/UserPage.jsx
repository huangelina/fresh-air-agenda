import { useParams } from 'react-router-dom';
import { useEffect, useState} from 'react';
import useToken from "@galvanize-inc/jwtdown-for-react";
import { useNavigate } from "react-router-dom";

const UserDetail = ({ token, userData }) => {

// useState variables

   const navigate = useNavigate();
   const { logout } = useToken();
   const [user, setUser] = useState({
       first: "",
       last: "",
       email: "",
       username: "",
       password: "",
       location: "",
       picture: "",
       goal: "",
       bio: "",
   });
   const [samePassword, setsamePassword] = useState(false)
   const [isEditable, setisEditable] = useState(false);
   const [isUser, setisUser] = useState(false);

   const { id } = useParams();

// loading effect to get userData
   const [isLoading, setIsLoading] = useState(true);


   useEffect(() => {

// fetch user data if not the logged in user
     const fetchData = async () => {
        if (token) {
            const url = `${process.env.REACT_APP_API_HOST}/users/${id}`;
            try {
                const response = await fetch(url, {
                    headers: { Authorization: `Bearer ${token}` },
                    credentials: "include",
                });

                if (response.ok) {
                    const data = await response.json();
                    setUser(data)

                    } else {
                    throw new Error('Network response was not ok');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
    };
// if logged in user, set page to prop data and enable editing
    if (userData.id === parseInt(id)) {
        setUser(userData)
        setisUser(true);
        Promise.all([
        setUser(userData),
        setisUser(true),
        ])
        .then(() => setIsLoading(false))
    }

    else {
        Promise.all([
            fetchData(),
        ])
        .then(() => setIsLoading(false))
    }

   }, [userData,id,token]);

   const handleDataChange = async (e) => {
       e.preventDefault();
       if (samePassword === user.password) {
        const accountData = {
            ...user,
            first: user.first,
            last: user.last,
            email: user.email,
            username: user.username,
            password: user.password,
            location: user.location,
            goal: user.goal,
            avatar_picture: user.picture,
            bio: user.bio,
        };

        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_HOST}/users/${id}`,
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
                logout()
                // reload?
                navigate("/login")
            } else {
                console.error('Failed to update user data:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error.message);
        }
    } else {
        throw new Error('Passwords do not match');
    }
};

if (user && isLoading === false) {
  return (
        <div>
          <div className="container py-2 h-100">
            {isEditable === false && (
            <div className="row justify-content-center align-items-center h-100">
              <div className="col col-lg-6 mb-4 mb-lg-0">
                <div className="card mb-3" style={{ borderRadius: "100rem" , width: "900px"}}>
                  <div className="row g-0">
                    <div
                      className="col-md-4 gradient-custom text-center text-black"
                      style={{
                        borderTopLeftRadius: ".5rem",
                        borderBottomLeftRadius: ".5rem",
                      }}
                    >
                      <img
                        src={user.avatar_picture}
                        alt="Avatar"
                        className="img-fluid my-5 rounded-circle"
                        style={{ width: "150px", height: "150px" }}
                      />
                      <h5>{user.username}</h5>
                      <p>{user.bio}</p>
                      {isUser && (
                        <button onClick={() => setisEditable(!isEditable)}>Edit</button>
                        )}
                    </div>
                    <div className="col-md-8">
                      <div className="card-body p-5" style={{  width: "500px"}}>
                        <h6>Information</h6>
                        <hr className="mt-0 mb-4" />
                        <div className="row pt-1">
                          <div className="col-6 mb-3">
                            <h6>Name</h6>
                            <p className="text-muted">
                              {user.first} {user.last}
                            </p>
                          </div>
                          <div className="col-6 mb-3">
                            <h6>Email</h6>
                            <p className="text-muted">{user.email}</p>
                          </div>
                        </div>
                        <h6>Projects</h6>
                        <hr className="mt-0 mb-4" />
                        <div className="row pt-1">
                          <div className="col-6 mb-3">
                            <h6>Goal</h6>
                            <p className="text-muted">{user.goal / 60}</p>
                          </div>
                          <div className="col-6 mb-3">
                            <h6>Location</h6>
                            <p className="text-muted">{user.location}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
      )}
</div>
{/* Edit form  */}
<div>
    {isEditable === true &&(
                  <div className="card text-bg-dark mb-3">
                      <h5 className="card-header">Hello {user.first}</h5>
                      <div className="card-body">
                          <form onSubmit={(e) => handleDataChange(e)}>
                              <div className="mb-3">
                                 <input
                                     name="first"
                                     type="text"
                                     className="form-control"
                                      placeholder="First Name"
                                     defaultValue={user.first}
                                     onChange={(e) => {
                                         setUser({...user, first: e.target.value});
                                     }}
                                 />
                              </div>
                              <div className="mb-3">
                                 <input
                                     name="last"
                                     type="text"
                                     className="form-control"
                                      placeholder="Last Name"
                                     defaultValue={user.last}
                                     onChange={(e) => {
                                         setUser({...user, last: e.target.value});
                                     }}
                                 />
                              </div>
                              <div className="mb-3">
                                 <input
                                     name="email"
                                     type="text"
                                     className="form-control"
                                      placeholder="Email"
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
                                      placeholder="Username"
                                     defaultValue={user.username}
                                     onChange={(e) => {
                                         setUser({...user, username: e.target.value});
                                     }}
                                 />
                              </div>
                              <div className="mb-3">
                                 <input
                                     name="location"
                                     type="text"
                                     className="form-control"
                                      placeholder="Location"
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
                                     placeholder="Profile Picture"
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
                                      placeholder="Hours you want to spend outside"
                                     defaultValue={user.goal / 60}
                                     onChange={(e) => {
                                         setUser({...user, goal: e.target.value * 60});
                                     }}
                                 />
                              </div>
                              <div className="mb-3">
                                 <input
                                     name="bio"
                                     type="text"
                                     className="form-control"
                                      placeholder="Bio"
                                     defaultValue={user.bio}
                                     onChange={(e) => {
                                         setUser({...user, bio: e.target.value});
                                     }}
                                 />
                              </div>
                              <div className="mb-3">
                                 <input
                                     required
                                     name="password"
                                     type="password"
                                      placeholder="Password"
                                     className="form-control"

                                     onChange={(e) => {
                                         setUser({...user, password: e.target.value});
                                     }}
                                 />
                              </div><div className="mb-3">
                                 <input
                                     required
                                     name="confirm password"
                                     type="password"
                                     className="form-control"
                                      placeholder="Confirm password"

                                     onChange={(e) => {
                                         setsamePassword(e.target.value);
                                     }}
                                 />
                              </div>
                              <div>
                                 <input className="btn btn-danger pr-2" type="submit" value="Update" />

                                <button className="btn btn-secondary ml-2" onClick={(e) => {
                                e.preventDefault();
                                setisEditable(!isEditable);
                                    }}>Cancel</button>
                                </div>
                          </form>
                          <div>
                            <p>Updating your profile will require you to sign back in!</p>
                            </div>
                      </div>
                  </div>
               )}
           </div>
        </div>
    )}
}
export default UserDetail;
