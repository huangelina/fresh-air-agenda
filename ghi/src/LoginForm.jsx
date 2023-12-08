import useToken from "@galvanize-inc/jwtdown-for-react";
import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";




const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useToken();
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(username, password);
    e.target.reset();
    navigate("/");
  };



  return (
    <div className="card text-bg-light mb-3">
      <h5 className="card-header">Login</h5>
      <div className="card-body">
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className="mb-3">
            <label className="form-label">Username:</label>
            <input
              name="username"
              type="text"
              className="form-control"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password:</label>
            <input
              name="password"
              type="password"
              className="form-control"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <input className="btn btn-primary" type="submit" value="Login" />
          </div>
        </form>
        <NavLink className="nav-link " to="/signup">
          Don't have an account?
        </NavLink>
      </div>
    </div>
  );
};

export default LoginForm;
