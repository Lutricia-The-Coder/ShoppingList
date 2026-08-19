
const ForgotPassword = () => {
  return (
 <div className="forgotPassword">
      <h1>Reset your password</h1>
        <form>
          <p>Enter your cell number to receive a verification code.</p>
          <label htmlFor="forgot-phone">Cell number</label>
          <input id="forgot-phone" type="tel" placeholder="+27 123 456 7891"  pattern="[+0-9 ()-]{7,}" required />
          <button type="submit">Send verification code</button>
        </form>
      
        <form>
          <label htmlFor="verification-code">Verification code</label>
          <input id="verification-code" inputMode="numeric" maxLength={6} required />
          <button type="submit">Verify code</button>
        </form>
      
        <form>
          <p>Enter a new password.</p>
          <label htmlFor="new-password">New password</label>
          <input id="new-password" type="password" minLength={8}  required />
          <label htmlFor="confirm-password">Confirm password</label>
          <input id="confirm-password" type="password" minLength={8} required />
          <button type="submit">Reset password</button>
        </form>
    
   
        <div>
          <button type="button" >Back to sign in</button>
        </div>
      
      
    </div>  )
}

export default ForgotPassword