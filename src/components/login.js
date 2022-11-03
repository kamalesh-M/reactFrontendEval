import React, { useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { populateUserDetail } from "../redux/userDetail";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';

import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
function LogIn(props) {
  const theme = createTheme();
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const [email,setEmail]= useState('');
    const [password,setPassword]= useState('');
    async function logInAuth(e){
        //const email= userEMail.current.value
        //const password = userPassWord.current.value
        
        e.preventDefault();
        console.log("////////",email,password)
        var UserDetails = undefined;
        if(email && email.length > 0 && password && password.length > 0){
        await fetch("http://localhost:8000/login", {   
            // Adding method type
            method: "POST",
            credentials: "include",
            // Adding body or contents to send
            body: JSON.stringify({
                username: email,
                password: password
            }),
            // Adding headers to the request
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        .then(response => response.json())
        .then(json => UserDetails = json);
        if(UserDetails && UserDetails.message === "Authenticated"){
          console.log("user details:",UserDetails)
          dispatch(populateUserDetail(UserDetails))
          navigate('/Dashboard');
        }
        else{
          props.alertErrorNotif("username/password does not match")
        }
      }
    }
    const emailInputHandler = e => {
      var value = e.target.value
      setEmail(value) 
    }
    const passwordInputHandler = e => {
      var value = e.target.value
      setPassword(value) 
    }
  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <p style={{color:"whitesmoke",fontSize:"24px"}}>
            Sign in
          </p>
          <Box component="form"noValidate sx={{ mt: 1 }}>
            <TextField
              onChange={emailInputHandler}
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              onChange={passwordInputHandler}
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              onClick={logInAuth} 
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default LogIn;
