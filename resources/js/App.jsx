import 'bootstrap';
import React from 'react';
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";
import Home from './pages/home'
import AboutUs from './pages/aboutus'
import News from './pages/news'
import Login from './pages/login'
import Register from './pages/register'
import Profile from './pages/profile'
import Jabatan from './pages/admin/jabatan'
import Member from './pages/admin/member'


const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "aboutus",
    element: <AboutUs />,
  },
	{
    path: "news/:id",
    element: <News />,
  },
    {
    path: "login",
    element: <Login />,
  },
    {
    path: "register",
    element: <Register />,
  },
    {
    path: "profile",
    element: <Profile />
  },
    {
    path: "admin",
    children: [
      {
        path: "jabatan", 
        element: <Jabatan />,
    },
      {
        path: "member",
        element: <Member />,
    },
    ]
  },
], {
	basename: "/react"
});

if(document.getElementById('root')){
	createRoot(document.getElementById("root")).render(
	  <RouterProvider router={router} />
	);
}
