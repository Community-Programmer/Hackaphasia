import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import MainLayout from './Layout/MainLayout'
import Home from './pages/Home/Home'
import MapDisplay from './pages/Map/MapDisplay'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
   
       
        </Route>
      </Routes>
      <Routes>
      <Route path='/map' element={<MapDisplay />} />

        </Routes>
    </>
  )
}

export default App
