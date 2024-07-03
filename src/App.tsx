
import { Suspense } from 'react'
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'
import { lazy } from 'react'
import { Toaster } from '@/components/Toast/toaster'
// import { Lang } from '@/components/Lang'

const AuthLayout = lazy(() => import('./Layout/AuthLayout'))
const Home = lazy(() => import('./pages/Home'))
const Result = lazy(() => import('./pages/Result'))
const User = lazy(() => import('./pages/User'))
const TravelList = lazy(() => import('./pages/User/TravelList'))
const SearchList = lazy(() => import('./pages/User/SearchList'))
const Settings = lazy(() => import('./pages/User/Settings'))
const Detail = lazy(() => import('./pages/Detail'))

const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/result/:id',
        element: <Result />
      },
      {
        path: '/detail/:id',
        element: <Detail />
      },
      {
        path: '/user',
        element: <User />,
        children: [
          {
            path: '/user',
            element: <TravelList />
          },
          {
            path: '/user/search',
            element: <SearchList />
          },
          {
            path: '/user/settings',
            element: <Settings />
          }
        ]
      }
    ]
  }
])

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RouterProvider
        router={router}
        fallbackElement={<div>Loading...</div>}
      >

      </RouterProvider>
      <Toaster />
      {/* <Lang /> */}
    </Suspense>
  )
}

export default App
