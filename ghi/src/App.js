import "./App.css";
import SignupForm from "./SignupForm.jsx"
import LoginForm from "./LoginForm.jsx"
import Main from "./Main.jsx"
import UserDetail from "./UserPage.jsx";
import DailyLog from "./DailyLog.jsx";
import { AuthProvider } from "@galvanize-inc/jwtdown-for-react";
import { BrowserRouter, Routes, Route } from "react-router-dom";



function App() {

  const domain = /https:\/\/[^/]+/;
  const basename = process.env.PUBLIC_URL.replace(domain, '');
  const baseUrl = `${process.env.REACT_APP_API_HOST}`;

  return (
   <BrowserRouter basename={basename}>
        <AuthProvider baseUrl={baseUrl}>
          <Routes>
            <Route exact path="/" element={<Main />}></Route>
            <Route exact path="/signup" element={<SignupForm />}></Route>
            <Route exact path="/login" element={<LoginForm />}></Route>
            <Route exact path="/users/:id" element = {<UserDetail />}></Route>
            <Route exact path="/dailylog" element={<DailyLog />}></Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>

  );
}

export default App;
