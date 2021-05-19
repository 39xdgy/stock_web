import React from 'react';
import { doSignOut } from '../firebase/FirebaseFunctions';
import { Link,Route } from 'react-router-dom';
const SignOutButton = () => {
  return (
   
    // <button className ="signOut" type="button" onClick={doSignOut}>
    //   Sign Out
    // </button>
    <Link to='/' onClick={doSignOut}>Sign Out</Link>
   
  );
};

export default SignOutButton;