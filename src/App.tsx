

import './App.css'
import LoginPage from './components/LoginPage'
import Dashboard from './components/Dashboard'
import ForgotPassword from './components/ForgotPassword'
import SignUp from './components/SignUp'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'



function App() {
  return (
    <> 
    <Router>
<Routes>
  <Route path="/"
  element={<SignUp />}/>
  <Route path="/loginpage"
  element={<LoginPage />}/>
  <Route path="/forgotpassword"
  element={<ForgotPassword />}/>
</Routes>
    </Router>
<Dashboard />
      </>
      )
  
}

export default App
