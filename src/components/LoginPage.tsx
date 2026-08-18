

const LoginPage = () => {
  return (
    <div className="loginForm">
                  <h1>Welcome back!</h1>
                  <p>Sign in to continue</p>

                  <form>
                     <div>
                        <label>Email</label>
                        <input type="email" id="email" name="email" placeholder="example.com" required></input>
                    </div>
                     <div>
                        <label>Password</label>
                        <input type="password" id="password" name="password" required ></input>
                     </div>

                        <label>
                           <input id="remember" name="remember" type="checkbox" required/>
                           <span>
                              Remember me
                           </span>
                        </label>

                        <a href="#">
                           Forgot password?
                        </a>
                     

                     <button type="submit">
                        Sign in</button>

                     <div >Don't have an account? <a href="#"> Sign  up</a>
                     </div>
                  </form>
               </div>
        
  )
}

export default LoginPage