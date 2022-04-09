import React, {useState} from "react";


function App() {
  const [uid, setUid] = useState('')
  const [email, setEmail] = useState('')
  const [pwd, setPassword] = useState('')
  const [pwdRep, pwdCheck] = useState('')

  const[username, getUsername] = useState('')
  const[password, getPassword] = useState('')

  // working on this still
  async function loginUser(event){
    event.preventDefault();
    if(username === "" || password ===""){
      alert("There are empty fields")
      return;
    }
    const response = await fetch('http://localhost:9999/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username,
        password
      })
    })
    const data = await response.json();
  
    if(data.data){
      localStorage.setItem('token', data.data);  
      alert("Login Successful");
        window.location.href = '/dashboard';
    } else {
      alert("Check yo mothafuckin username and password");
    }
  
  }

  async function registerUser(event){
    event.preventDefault();
    const numWins = 0;
    const ifOnline = false;
    if(pwdRep !== pwd){
      alert('Passwords Do not Match')
      return;
    }
    const response = await fetch('http://localhost:9999/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        uid,
        pwd,
        numWins,
        ifOnline
      })
    })

    const data = await response.json();
    if(data.status === 'ok'){
      setUid("");
      setEmail('');
      setPassword('');
      pwdCheck('');
    }
    console.log(data);
  }

  return (
      <div>
        <nav class="top-bar b-b-blue">
            <div class="nav-left" onclick="onNavClick()"> Nav </div>
            <div class="title"> Muldle </div>
            <button class="nav-right" onclick="onAccountClick()">Account</button>
        </nav>
      <div class="login-container">
        <h1> Login</h1>
        <form class="login-form" onSubmit={loginUser}>
          <div class="input-container">
          <input
            value={username}
            onChange={(e) => getUsername(e.target.value)}
            type="text"
            placeholder="Username"
          />
          </div>
          <div class="input-container">
          <input
            value={password}
            onChange={(e) => getPassword(e.target.value)}
            type="password"
            placeholder="Password"
          />
          </div>
          <input
            type="submit"
            value="Login"
          />
        </form>
      </div>
      <div class="login-container">
        <h1> Don't Have an Account? Sign up</h1>
        <form class="login-form" onSubmit={registerUser}>
        <div class="input-container">
            <input 
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              type="email" 
              placeholder="Your Email"
            />
            </div>
            <div class="input-container">
            <input
              value={uid}
              onChange={(e) => setUid(e.target.value)}
              type="text"
              placeholder="Your Username"
            />
            </div>
            <div class="input-container">
            <input
              value={pwd}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Your Password"
            />
            </div>
            <div class="input-container">
            <input
              value={pwdRep}
              onChange={(e) => pwdCheck(e.target.value)}
              type="password"
              placeholder="Confirm Password"
            />
            </div>
            <input 
              type="submit" 
              value="Register"
            />
          </form>
      </div>
      </div>
  );
}
export default App;
