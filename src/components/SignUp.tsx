

const SignUp = () => {
  return (
<div className="signup">
    <h1>
        Create Account
    </h1>
<form>
    
<label>Name</label>
<input type="text" placeholder="lulu" required></input>
<label>Surname</label>
<input type="text" placeholder="ngomane" required></input>
<label>Cell Number</label>
<input type="text" placeholder="+27 123 456 7891" required></input>
<label>Email</label>
<input type="text" placeholder="example.com" required></input>
<label>Password</label>
<input type="password" required></input>
<label>Confirm password</label>
<input type="password" required></input>
<button>Sign up</button>
<label>
    <span>
        Already have an account? Sign in
    </span>
</label>
</form>
</div>  )
}

export default SignUp