import { AddUser } from './addUser/AddUser';
import './App.css';
import User from './getUser/User';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Update from './updateUser/Update';

function App() {
  const route = createBrowserRouter([
    {
      path: "/",
      element: <User />
    },
    {
      path: "/add",
      element: <AddUser />
    },
    {
      path: "/update/:id",
      element: <Update />
    }
  ]);

  return (
    <div className="App">
      <RouterProvider router={route} />
    </div>
  );
}

export default App;
