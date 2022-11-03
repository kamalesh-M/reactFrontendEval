import { div,IconButton } from "@material-ui/core";
import React,{ useState } from "react";
import { MTableBodyRow } from "material-table";
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import PatientForm from "../patientForm";
import './button.css'
import { Button } from "@material-ui/core";
import {
    Dialog,
    DialogContent,
    DialogTitle
}from '@mui/material'
const CustomRow= (props)=>{
    const [openEditDialog,setOpenEditDialog] = useState(false);
    const [patientId,setPatientId] = useState("");
    const closePatientDialog = value => {
        //value.preventDefault();
        setOpenEditDialog(false)
        window.location.reload();
    }
    const [patientEditObj,setPatientEditObj] = useState({
        Firstname:'',
        Lastname:'',
        Middlename: '',
        phoneNumber: '',
        Address: '',
        weight: 0,
        height: 0,
        Doctor: '',
        email: '',
        country: '',
        state: '',
        zipcode: ''
    });
    const overlayStyle={width:"100%",position:"absolute"}
    return <div style={{display:'contents'}}>
        <Dialog open={openEditDialog} PaperProps={{ style: {
            minHeight: '90%',
            maxHeight: '90%',
            minWidth: '900px'
        }}}>
            <DialogTitle>
              Patient Edit Form{}
              <Button style={{background: "red",color:"white",float:"right"}} onClick={()=> {
                    setOpenEditDialog(false)
                }} className="CloseButton">X</Button>
            </DialogTitle>
            <DialogContent>
              <PatientForm dialogMethod="EDIT" EditObj={patientEditObj} patientId={patientId} closeHandler={closePatientDialog}/>
            </DialogContent>
        </Dialog>
        <div align="right" style={overlayStyle}>
            <div>
                <IconButton style={{marginRight:"35px"}} onClick={()=> {
                    setPatientEditObj({
                        Firstname:props.data.Firstname,
                        Lastname:props.data.Lastname,
                        Middlename: props.data.Middlename,
                        phoneNumber: props.data.phoneNumber,
                        Address: props.data.Address,
                        weight: props.data.weight,
                        height: props.data.height,
                        Doctor: props.data.Doctor,
                        email: props.data.email,
                        country: props.data.country,
                        state: props.data.state,
                        zipcode: props.data.zipcode
                    })
                    setPatientId(props.data._id)
                    setOpenEditDialog(true)
                    console.log("sending edit obj",props.data)
                }}>
                    <ModeEditOutlineOutlinedIcon />
                </IconButton>
            </div>
        </div>
        <MTableBodyRow {...props} />
    </div>

}

export default CustomRow;