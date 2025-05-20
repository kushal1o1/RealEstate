import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import HomePage from './routes/homePage/HomePage'
import ListPage from './routes/listPage/ListPage'
import SinglePage from './routes/singlePage/SinglePage'
import ProfilePage from './routes/profilePage/ProfilePage'
import Login from './routes/login/Login'
import Register from './routes/register/Register'
import { Layout,RequireAuth } from './routes/layout/Layout'
import ProfileUpdatePage from './routes/profileUpdatePage/ProfileUpdatePage'
import NewPostPage from './routes/newPostPage/NewPostPage'
import { singlePageLoader,listPageLoader,profilePageLoader } from './lib/loaders.js'
import Contact from './routes/contactPage/Contact'
import Agent from './routes/agentPage/Agent'
import About from './routes/aboutPage/About'
import UpdatePostPage from './routes/updatePostPage/UpdatePostPage'
function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          path: '/',
          element: <HomePage />,
        },
        {
          path: '/list',
          element: <ListPage />,
          loader: listPageLoader,
        },
        {
          path: '/:id',
          element: <SinglePage />,
          loader:singlePageLoader,
        },

        {
          path:"/login",
          element:<Login/>
        },
        {
          path:"/register",
          element:<Register/>
        },
        {
          path:"/contact",
          element:<Contact/>
        },
        {
          path:"/agent",
          element:<Agent/>
        },
        {
          path:"/about",
          element:<About/>
        }
      ]
    },
    {
      path:'/',
      element:<RequireAuth/>,
      children:[
        {
          path: '/profile',
          element: <ProfilePage />,
          loader: profilePageLoader,
        },
        {
          path:'/profile/update',
          element:<ProfileUpdatePage/>
        },
                {
          path:'/post/update',
          element:<NewPostPage/>
        },
        {
          path:'/post/update/:id',
          element:<UpdatePostPage/>,
        }
      ]

    }
  ])

  return (
    <RouterProvider router={router} />
  )
}


export default App