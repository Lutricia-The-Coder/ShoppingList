

const SignUp = () => {
  return (
  <div className="signup">
    <h1>
        Create Account
    </h1>
<form >
    <div>
<label>Name</label>
<input type="text" placeholder="lulu" required></input>
 </div>
<div>
<label>Surname</label>
<input type="text" placeholder="ngomane" required></input>
</div>

<div>
    <label>Cell Number</label>
<input type="text" placeholder="+27 123 456 7891" required></input>
</div>

<div>
    <label>Email</label>
<input type="text" placeholder="example.com" required></input>
</div>

<div>
    <label>Password</label>
<input type="password" minLength={8} required></input>
</div>
<div>
    <label>Confirm password</label>
<input type="password" minLength={8} required></input>
</div>

<div><button>Sign up</button></div>
<div><button type="button">
    <span>
        Already have an account? Sign in
    </span>
</button></div>

</form>
</div> 
  )
}

export default SignUp