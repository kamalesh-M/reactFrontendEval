import React from "react";
import "./home.css";
import SingUp from './signup';
import LogIn from './login';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function Home() {
    const errorMessge = '';
    const alertErrorNotif = e => {
      console.log("error messge",e)
      toast.error(e, {
        position: toast.POSITION.TOP_RIGHT
      });
    }

    
  return (
    <>
      <ToastContainer />
      <div className="Optionsflex">
      < div className="LogInOuter">
          <div className="LogInOption">
            <LogIn alertErrorNotif={alertErrorNotif}></LogIn>
          </div>
        </div>
        <div className="signUpOuter">
          <div className="signUpOption">
            <SingUp alertErrorNotif={alertErrorNotif}></SingUp>
          </div>
        </div>  
      </div>
    </>
  );
}

export default Home;
