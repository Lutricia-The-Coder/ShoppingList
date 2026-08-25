

import './App.css'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from "./routes/AppRoutes"
import Navbar from "./components/Navbar";


function App() {
  return (
    <BrowserRouter> 
<AppRoutes />
<Navbar />
      </BrowserRouter>
      )
  
}

export default App
