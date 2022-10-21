import 'bootstrap';
import React from 'react';
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
  Outlet,
  useRouteError,
} from "react-router-dom";
import request from './axios';
import Home from './pages/home'
import AboutUs from './pages/aboutus'
import News from './pages/news'
import Login from './pages/login'
import Register from './pages/register'
import Profile from './pages/profile'
import Notification from './pages/notification'
import Jabatan from './pages/admin/jabatan'
import Member from './pages/admin/member'
import Slider from './pages/admin/slider'
import AdminNews from './pages/admin/news'
import Finance from './pages/admin/finance'
import Header from './components/header'
import Error from './components/error'

const App = () => {
  const error = useRouteError();
  const [auth, setAuth] = React.useState()

  const fetchAuth = async() => {
      try {
          const res = await request.get('/user')
          if(res.status == 200 && res.data) {
              if(res.data) setAuth(res.data)
          }
      } catch (err) {
          if (err.response && err.response.status == 401) {
            setAuth(null)
          }
      }
  }

  React.useEffect(() => {
      fetchAuth()
  }, [])

  return (
    <div>
      <Header fetch={fetchAuth} auth={auth} />
      { !error && <Outlet context={{auth, fetchAuth}} /> }
      <Error error={error} />
    </div>
  )
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <App />,
    children: [
      {
        index: true,
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
        path: "notification",
        element: <Notification />
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
          {
            path: "slider",
            element: <Slider />
          },
          {
            path: "news",
            element: <AdminNews />
          },
          {
            path: "finance",
            element: <Finance />
          }
        ]
      },
    ]
  },
], {
	basename: "/react"
});

if(document.getElementById('root')){
	createRoot(document.getElementById("root")).render(
    <RouterProvider
      router={router}
      fallbackElement={
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      }/>
	);
}
