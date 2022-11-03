import React, {  useState } from "react";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//import { json } from "react-router-dom";
function SingUp(props) {
    const theme = createTheme();
    const [email,setEmail]= useState('');
    const [username,setusername]= useState('');
    const [password,setPassword]= useState('');
    const [userConfirmPassword,setuserConfirmPassword]= useState('');
    async function SignUpAuth(e){
        console.log("clicked")
        e.preventDefault();
        var emailFlag = false
        var passwordConditionFlag = false
        var passwordMatchingFlag = false
        var lowerCaseLetters = /[a-z]/g;
        var upperCaseLetters = /[A-Z]/g;
        var numbers = /[0-9]/g;
        // eslint-disable-next-line
        var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if(email.match(mailformat))
        {
          emailFlag=true
        }
        else
        {
         
          props.alertErrorNotif("enter valid email")
          emailFlag = false
        }
        if(password === userConfirmPassword){
          passwordMatchingFlag = true
          if(password.length > 8  && password.match(lowerCaseLetters) && password.match(upperCaseLetters) && password.match(numbers)){
            passwordConditionFlag = true
          }
          else{
            passwordConditionFlag = false
            props.alertErrorNotif("password should be 8characters long, contain both upper and lowercase letters")
          
          }
        }
        else{
          props.alertErrorNotif("password doesnt match")
          passwordMatchingFlag = false
        }
        var singUpResponse = undefined;
        if(emailFlag && passwordConditionFlag && passwordMatchingFlag){
          await fetch("http://localhost:8000/user/signUp", {   
              // Adding method type
              method: "POST",
              // Adding body or contents to send
              body: JSON.stringify({
                  email: email,
                  password: password,
                  username: username
              }),
              // Adding headers to the request
              headers: {
                  "Content-type": "application/json; charset=UTF-8"
              }
          })
          .then(response => response.json())
          .then(json => singUpResponse = json)
          console.log("singup Response",singUpResponse)
          if(singUpResponse.message === "Sucess" && singUpResponse.status === "200"){
            console.log("succes on creating a new user")
            toast.success('Success Notification !', {
              position: toast.POSITION.TOP_RIGHT
            });
            window.location.reload();
          }
        }else{
          props.alertErrorNotif("validation failed")
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
    const ConfirmpasswordInputHandler = e => {
      var value = e.target.value
      setuserConfirmPassword(value) 
    }
    const userNameInputHandler = e => {
      var value = e.target.value
      setusername(value) 
    }
  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <ToastContainer />

        <CssBaseline />
        <Box
          sx={{
            marginTop: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" style={{color:"whitesmoke"}}>
            Sign Up
          </Typography>
          <Box component="form"noValidate sx={{ mt: 1 }}>
            <TextField
              onChange={emailInputHandler}
              margin="normal"
              required
              fullWidth
              id="signUpemail"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              onChange={userNameInputHandler}
              margin="normal"
              required
              fullWidth
              id="username"
              label="username"
              name="username"
              autoComplete="username"
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
              id="singUppassword"
              autoComplete="current-password"
            />
            <TextField
              onChange={ConfirmpasswordInputHandler}
              margin="normal"
              required
              fullWidth
              name="confirmpassword"
              label="confirmpassword"
              type="password"
              id="confirmpassword"
              autoComplete="current-password"
            />
            <Button
              onClick={SignUpAuth} 
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default SingUp;
