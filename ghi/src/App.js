import { useEffect, useState } from "react";

import "./App.css";
import SignupForm from "./SignupForm.jsx"
import LoginForm from "./LoginForm.jsx"
import Main from "./Main.jsx"
import { AuthProvider } from "@galvanize-inc/jwtdown-for-react";
import { BrowserRouter, Routes, Route } from "react-router-dom";



function App() {

  const baseUrl = `${process.env.REACT_APP_API_HOST}`;

  return (
   <BrowserRouter>
        <AuthProvider baseUrl={baseUrl}>
          <Routes>
            <Route exact path="/" element={<Main />}></Route>
            <Route exact path="/signup" element={<SignupForm />}></Route>
            <Route exact path="/login" element={<LoginForm />}></Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>

  );
}

export default App;
