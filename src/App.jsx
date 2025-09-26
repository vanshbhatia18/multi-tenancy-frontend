import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Register from './components/register'
import Login from './components/login'
import PrivateRoute from './components/PrivateRoute'
import Note from "./components/notes"
import { Route, Routes } from "react-router-dom";
import SingleNote from './components/SingleNote'
function App() {
  const [count, setCount] = useState(0)
  const [user, setUser] = useState(null);


  return (
    <div className="flex flex-col overflow-hidden bg-white ">

      <Routes>
        <Route>
          <Route path="register" element={<Register />} />
          <Route
            path="/app"
            element={
              <PrivateRoute>
                <Note />
              </PrivateRoute>
            }
          />
          <Route
            path="/getnote/:id"
            element={
              <PrivateRoute>
                <SingleNote />
              </PrivateRoute>
            }
          />
          <Route path='/login' element={<Login />}></Route>
        </Route>
      </Routes>
    </div>
  )
}

export default App
