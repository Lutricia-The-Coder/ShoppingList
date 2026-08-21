

import './App.css'
import { BrowserRouter } from 'react-router-dom'
import AppRoute from "./routes/AppRoute"
import Register from './components/Register'


function App() {
  return (
    <BrowserRouter> 
<AppRoute />
<Register />


      </BrowserRouter>
      )
  
}

export default App
