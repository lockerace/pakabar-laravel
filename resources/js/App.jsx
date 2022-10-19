import React from 'react';
import { createRoot } from 'react-dom/client'
import{
    createBrowserRouter,
    RouterProvider,
    Route,
    Link,
} from "react-router-dom";
import Home from './pages/home'
import About from './pages/aboutus'

const router = createBrowserRouter([
    {
        path: "",
        element: <Home Judul="Test2"/>,
    },
    {
        path: "aboutus",
        element: <About />,
    }
], {
    basename: "/react"
});

if(document.getElementById('root')){
    createRoot(document.getElementById("root")).render(
        <RouterProvider router = {router} />
    );
}