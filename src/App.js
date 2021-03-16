
import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';
import { useState } from 'react';


firebase.initializeApp(firebaseConfig);

function App() {
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    photo: '',
    email: '',
    password:'',
    error : '',
    success : false
  });

  const provider = new firebase.auth.GoogleAuthProvider();
//
  const handleSignIn = () => {
    firebase.auth().signInWithPopup(provider)
      .then(result => {
        const { displayName, photoURL, email } = result.user;
        const signedInUser = {
          isSignedIn: true,
          name: displayName,
          photo: photoURL,
          email: email
        }
        setUser(signedInUser);
        console.log(displayName, photoURL, email)
      })
      .catch(err => {
        console.log(err)
      })
    // console.log('signed in click')
  }
//
  const handleSignOut = () => {
    firebase.auth().signOut()
      .then(res => {
        const signedoutuser = {
          isSignedIn: false,
          name: '',
          photo: '',
          email: ''
        };
        setUser(signedoutuser);
        console.log('sign out successful');
      }
      )
      .catch(err => { console.log(err) })
  }
//
  const handleSubmit = (e) => {
    console.log(user.email, user.password);
    if(user.email && user.password){
      console.log('submitting..')

      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then((userCredential) => {
        // Signed in 
        // const user = userCredential.user;
        const newUser = {...user};
        newUser.error = '';
        newUser.success = true;
        setUser(newUser)
        console.log(user)
        // ...
      })
      .catch((error) => {
        // var errorCode = error.code;
        // var errorMessage = error.message;
        // ..
        const newUser = {...user};
        newUser.error = error.message;
        newUser.success = false;
        setUser(newUser)
        console.log(error)
      });
    







    }
    e.preventDefault();
    console.log('own submit clicked')
  }
  //
  const handleBlur = (evnt) => {
    let isFieldValid = true;
    if (evnt.target.name === 'email') {
      const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/; //regex valid email pattern
      // re.test(evnt.target.value) ? console.log('valid email') : console.log('invalid email') //regex.test(whattoteststring) return true/false
      // console.log(evnt.target.value)
      // const isEmailValid = re.test(evnt.target.value);
      isFieldValid = re.test(evnt.target.value);
      // console.log(isEmailValid)
    }
    if (evnt.target.name === 'password') {
      const isPasswordValid = evnt.target.value.length > 6;
      //  console.log(isPasswordValid)
      const re = /\d{1}/;
      const passwordHasNumber = re.test(evnt.target.value);
      // console.log(isPasswordValid && passwordHasNumber);
      isFieldValid = isPasswordValid && passwordHasNumber;

      //  ? console.log('password valid') : console.log('password is invalid');
    }
if(isFieldValid){
  //[...cart,newcart]
  const newUserInfo = {...user}; //copy object
  newUserInfo[evnt.target.name] = evnt.target.value; //set object property
  setUser(newUserInfo)
}
    console.log(evnt.target.name, evnt.target.value);
    // console.log(event.target.value)

  }

  return (
    <div className="App">
      {
        user.isSignedIn ? <button onClick={handleSignOut}>LogOut</button> : <button onClick={handleSignIn}>Sign In</button>
      }


      {
        user.isSignedIn && <div>
          <p>User Name: {user.name}</p>
          <p>Photo: <img src={user.photo} alt="" /></p>
          <p>Email: {user.email}</p>
        </div>

      }

      <div>
        <h1>Our own authentication system</h1>
        <div>
          <p>Name:{user.name}</p>
          <p>Email:{user.email}</p>
          <p>Password:{user.password}</p>
        </div>
        <form onSubmit={handleSubmit}>
          <input type='text' placeholder='name' name='name' onBlur={handleBlur}/><br/>
          <input type='text' onBlur={handleBlur} name='email' placeholder='email' required /><br />
          <input type='password' onBlur={handleBlur} name='password' placeholder='password' required /><br />
          <input type='submit' value='Submit' />

          {/* <button type='submit'>Submit</button> */}
        </form>
        <div>
          <p style={{color:'red'}}>{user.error}</p>
          {
            user.success && <p style={{color:'green'}}> User created successfully</p>
          }
        </div>
      </div>


    </div>
  );
}

export default App;
