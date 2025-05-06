import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import HomePage from './routes/homePage/HomePage'
import ListPage from './routes/listPage/ListPage'
import Layout from './routes/layout/Layout'

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
        },
      ]
    }
  ])

  return (
    <RouterProvider router={router} />
  )
}


export default App