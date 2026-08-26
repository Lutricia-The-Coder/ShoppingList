

import './App.css'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from "./routes/AppRoutes"
import Navbar from "./components/Navbar";


function App() {
  return (
    <BrowserRouter> 
      <div className="app-container">
    <Navbar />
<AppRoutes />
</div>
      </BrowserRouter>
      )
  
}

export default App
