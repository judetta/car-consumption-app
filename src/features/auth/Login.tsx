import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Button, Paper, TextField } from '@mui/material';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';

import './Login.scss';
import { login } from './authSlice';
import { auth } from '../../firebase/firebase';
import { useAppDispatch } from '../../shared/hooks';

export function Login() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [createNewUser, setCreateNewUser] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(userAuth => {
        dispatch(login({
          uid: userAuth.user.uid,
          email: userAuth.user.email,
          displayName: userAuth.user.displayName
        }));
        navigate('/cars');
      })
      .catch((error: FirebaseError) => {
        if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
          displayBriefErrorMsg('Incorrect email or password');
        } else {
          displayBriefErrorMsg('Unknown error in authentication');
          console.log(error);
        }
      });
  };

  const handleSignUp = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(userAuth => {
        updateProfile(userAuth.user, {
          displayName: displayName
        })
          .then(() => {
            dispatch(
            login({
              uid: userAuth.user.uid,
              email: userAuth.user.email,
              displayName: displayName
            }));
            navigate('/cars');
          })
          .catch(error => {
            console.log(error);
          });
      })
      .catch((error: FirebaseError) => {
        if (error.code === 'auth/email-already-in-use') {
          displayBriefErrorMsg('Email is already in use');
        } else {
          displayBriefErrorMsg('User could not be created');
          console.log(error);
        }
      });
  };

  const displayBriefErrorMsg = (msg: string) => {
    setErrorMsg(msg);
    setTimeout(() => {
      setErrorMsg('');
    }, 5000);
  };

  return (
    <Paper className='Login' elevation={3}>
      <p>{createNewUser ? 'Create new account' : 'Log in to use this app'}</p>
      {createNewUser &&
        <TextField
          className="input"
          value={displayName}
          label='Name'
          onChange={e => setDisplayName(e.target.value)}
        />
      }
      <TextField
        className="input"
        value={email}
        type='email'
        label='Email'
        onChange={e => setEmail(e.target.value)}
      />
      <TextField
        className="input"
        value={password}
        type='password'
        label='Password'
        onChange={e => setPassword(e.target.value)}
      />
      <Button
        className='button'
        variant='contained'
        onClick={createNewUser ? handleSignUp : handleLogin}
      >
        {createNewUser ? 'Sign up!' : 'Log in'}
      </Button>
      {errorMsg.length > 0 &&
        <Alert className="alert" severity="error" onClose={() => setErrorMsg('')}>{errorMsg}</Alert>
      }
      <p>{createNewUser ? 'Already have an account?' : 'Not yet a user?'}</p>
      <Button
        className="button"
        variant="outlined"
        onClick={() => setCreateNewUser(!createNewUser)}
      >
        {createNewUser ? 'Log in' : 'Create an account'}
      </Button>
    </Paper>
  );
}