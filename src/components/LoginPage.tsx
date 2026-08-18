

const LoginPage = () => {
  return (
    <div className="loginForm">
        <form >
            <label>Email:</label>
            <input type="text" placeholder="example.com" required></input>
            <label>Password:</label>
            <input type="password" required></input>
            
        </form>
    </div>

  )
}

export default LoginPage