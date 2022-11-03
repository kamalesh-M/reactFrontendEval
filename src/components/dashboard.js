import React from "react";
import { useSelector } from "react-redux";
import {useEffect,useState} from 'react';
import { useDispatch } from "react-redux";
import Table from "./patientTabel";
import PatientForm from "./patientForm";
import {populatePatientDetail} from"../redux/patientDetail";
import './button.css'
import {
  Dialog,
  DialogContent,
  DialogTitle
}from '@mui/material'
import { Button } from "@material-ui/core";

function Dashboard() {
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.user)
    const [openDialog,setopenDialog] = useState(false);
    const [dataLoaded, setDataLoaded] = useState(false);
    const doctorId = user.doctorId
    useEffect(() => {
      console.log("doctor id:",doctorId)
      //have to call the fetchingapi method in async and then set the loading variable to true to stop table component from laoding before dahsboard
      createPatientApiCall()

        
      },[]);
      async function createPatientApiCall(queryObj){

        await fetch(`http://localhost:8000/patient/${doctorId}`, {   
          // Adding method type
          method: "GET",
          credentials: "include",
          headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
        })
        .then(response => response.json())
        .then(json => {
        console.log("patient details:",json)
        dispatch(populatePatientDetail(json))
        })
        setDataLoaded(true)
      }
      const openSavePatientHAndler = value => {
        //value.preventDefault();
        setopenDialog(true)
        
      }
      const closePatientDialog = value => {
        //value.preventDefault();
        setopenDialog(false)
        window.location.reload();
      }
  return (
    <>
    <div>
      
      <div style={{margin:"0 auto",width:'75vw',marginTop:'15px'}}>
        { dataLoaded && <Table dialogHandler={openSavePatientHAndler}  openDialog={openDialog}  />}
        
      </div>
      <div>
      </div>
      <Dialog open={openDialog} PaperProps={{ style: {
        minHeight: '90%',
        maxHeight: '90%',
        minWidth: '900px'
      }}}>
        <DialogTitle>
          <div style={{justifyContent:"space-between",display:"flex"}}>
          <p>Patient Create Form</p>
          <Button style={{background: "red",color:"white"}} onClick={closePatientDialog} className="CloseButton">X</Button>
          </div>
        </DialogTitle>
        <DialogContent>
          <PatientForm closeHandler={closePatientDialog} dialogMethod="CREATE"/>
        </DialogContent>
      </Dialog>
    </div>
    </>
  );
}

export default Dashboard;
