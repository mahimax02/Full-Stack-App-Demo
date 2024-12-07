import React from 'react'

import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

/** import all component  */
import Username from './components/UserName';
import Register from './components/Register';
import Password from './components/Password';
import Profile from './components/Profile';
import Reset from './components/Reset';
import Recovery from './components/Recovery';
import PageNotFound from './components/PageNotFound';

/** root routes */

const router = createBrowserRouter([
  {
    path:'/',
    element:<Username></Username>
  },
  {
    path:'/register',
    element: <Register></Register>
  },
  {
    path: '/password',
    element:<Password></Password>
  },
  {
    path:'/profile',
    element:<Profile></Profile>
  },
  {
    path:'/recovery',
    element:<Recovery></Recovery>
  },
  {
    path:'/reset',
    element:<Reset></Reset>
  },
  {
    path:'*',
    element: <PageNotFound></PageNotFound>
  }

])

function App() {
  return (
    <div className="App">
      <main>
        <RouterProvider router={router}>

        </RouterProvider>
      </main>
    </div>
  );
}

export default App;
