import { useState } from "react";
import useToken from "@galvanize-inc/jwtdown-for-react";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";

const SignupForm = () => {
  const [firstName, setFirstName] = useState("");
  const [goal, setGoal] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [location, setLocation] = useState("");
  const { login } = useToken();
  const [errorMessage, setErrorMessage] = useState();
  const navigate = useNavigate();



  const handleRegistration = async (e) => {
    e.preventDefault();
    const accountData = {
      first: firstName,
      last: lastName,
      email: email,
      username: username,
      password: password,
      location: location,
      goal: goal,

    };
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_HOST}/users`,
        {
          method: "POST",
          credentials: "include",
          body: JSON.stringify(accountData),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );


      if (!response.ok) {
        setErrorMessage(
          "Couldn't create account, please try a new username or email address"
        );
        return;
      }
      await login(accountData.username, accountData.password);
      e.target.reset();
      navigate("/");
    } catch (e) {
      setErrorMessage(
        "Couldn't create account, please try a new username or email address"
      );
    }
  };

  return (
    <div className="card text-bg-light mb-3">
      <h5 className="card-header">Signup</h5>
      <div className="card-body">
        <form onSubmit={(e) => handleRegistration(e)}>
          {errorMessage ? <p>{errorMessage}</p> : ""}
          <div className="mb-3">

            <input
              name="firstname"
              type="text"
              className="form-control"
              placeholder="First Name"
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
              placeholder="Last Name"
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
              placeholder="Email"
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
              placeholder="Username"
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
              placeholder="Password"
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
              placeholder="City"
              onChange={(e) => {
                setLocation(e.target.value);
              }}
            />
          </div>
          <div className="mb-3">
            <input
              name="goal"
              type="int"
              className="form-control"
              placeholder="Weekly Goal"
              onChange={(e) => {
                setGoal(e.target.value * 60);
              }}
            />
          </div>
          <div>
            <input className="btn btn-primary" type="submit" value="Register" />
          </div>
        </form>
        <NavLink className="nav-link" to="/login">
         Already have an account?
      </NavLink>
      </div>

    </div>
  );
};

export default SignupForm;
