import {BrowserRouter  , Routes  , Route } from "react-router-dom"
import CollegePredictor from './pages/CollegePredictor'
import Navbar from './components/Navbar'
import { useState , useEffect } from 'react'
import ThemeProvider from "./components/ThemeProvider"
function App() {
  const [theme  , setTheme] = useState("dark");
  const handleTheme = () => {
      setTheme(theme === "dark" ? "light" : "dark");
  }

  return (
    <>
    <ThemeProvider theme = {theme} >
    <Navbar theme={theme} handleTheme={handleTheme}/>
    <BrowserRouter>
    <Routes>
      
    <Route path = "/" element = {<CollegePredictor/>}/>
    <Route path = "/option-form" element = {<CollegePredictor/>}/>
    </Routes>
    </BrowserRouter>
    </ThemeProvider>
    </>
  )
}

export default App
