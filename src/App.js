
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
    email: ''
  });

  const provider = new firebase.auth.GoogleAuthProvider();
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
  const handleSignOut = ()=>{
    firebase.auth().signOut()
    .then(res=>{
      const signedoutuser = {
        isSignedIn : false,
        name: '',
        photo : '',
        email:''
      };
      setUser(signedoutuser);
      console.log('sign out successful');
    }
      )
    .catch(err=>{console.log(err)})
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

    </div>
  );
}

export default App;
