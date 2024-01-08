import React, { createContext, useState } from "react";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import FeedbackList from "./FeedbackList";
import FeedbackForm from "./FeedbackForm";
import Login from "./Login";
import Register from "./Register";
import Protected from "./Protected";
import "./App.scss"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to={"/login"} />,
  },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/feedback", element: <Protected Component={FeedbackList} /> },
  { path: "/add-feedback", element: <Protected Component={FeedbackForm} /> },
]);

export const AppContext = createContext()

function App() {

  const [user, setUser] = useState(undefined)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  return <AppContext.Provider value={{
    isLoggedIn,
    user,
    setUser, setIsLoggedIn
  }}>
    <RouterProvider router={router} />
  </AppContext.Provider>;
}

export default App;
