

import './App.css'
import Dashboard from './components/Dashboard'
import ForgotPassword from './components/ForgotPassword'
import SignUp from './components/Register'
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
