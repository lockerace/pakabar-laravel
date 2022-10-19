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
], {
	basename: "/react"
});

if(document.getElementById('root')){
	createRoot(document.getElementById("root")).render(
	  <RouterProvider router={router} />
	);
}