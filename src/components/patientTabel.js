import React from "react";
import {useState} from 'react';
import MaterialTable from 'material-table';
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {populatePatientDetail} from"../redux/patientDetail";
import PatientForm from "./patientForm";
import { setAutoFreeze } from 'immer'; 
//import { alpha } from '@material-ui/core/styles'
import {
    Dialog,
    DialogContent,
    DialogTitle
}from '@mui/material'
import CustomRow from "./customRow";
function Table(props) {
    const dispatch = useDispatch()
    const [openEditDialog,setOpenEditDialog] = useState(false);
    const { patient } = useSelector((state) => state.patient)
    var patientList = patient.map(patient => ({ ...patient}));
    const [data, setData] = useState(patientList)
    const { user } = useSelector((state) => state.user)
    const doctorJwt = user.access_token
    
    
    const columns = [
        { title: 'Sl no', field: 'tableData.id', render:rowData => rowData.tableData.id+1,width: "10%"} ,
        {
            title:'name',
            field: 'Firstname',
            render: (row)=> row.Firstname +" " + row.Lastname, width: "20%"
        },
        {
            title:"Email",field:"email", width: "20%"
        },
        {
            title:"PhoneNumber",field:"phoneNumber", width: "20%"
        },
        {
            title:"Address",render: (row)=> truncate(row.Address), width: "30%"
        }
    ]
    async function checkAuth(e){
        var responseCopy;
        console.log("checking AUth")
        await fetch("http://localhost:8000/protected", {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${doctorJwt}`, // notice the Bearer before your token
            }
        }).then(response => response.json())
        .then(json =>  responseCopy = json);

        //checking if the user is authentic by sending the jwt to validate it

        if(responseCopy.message === "Authentic User"){
            return true
        }
        else{
            return false
        }    
    }
    async function deletePatient(patientId){
        var delObj;
        await fetch(`http://localhost:8000/patient/${patientId}`, {
            method: 'DELETE',
            credentials: "include",
        }).then(response => response.json())
        .then(json =>  delObj = json)
        return delObj;
    }
    
    async function addPatientDialogToggle(){
        console.log("paitent create function called") 
        props.dialogHandler()
        //setopenDialog(true)
    }
    function truncate(str){
        return str.length > 25 ? str.substring(0, 20) + "..." : str;
    }
    
    return (
      <>
        <div>
        <Dialog open={openEditDialog} PaperProps={{ style: {
            minHeight: '90%',
            maxHeight: '90%',
            minWidth: '900px'
        }}}>
            <DialogTitle>
              Patient Edit Form
            </DialogTitle>
            <DialogContent>
              <PatientForm  dialogType="Hello" />
            </DialogContent>
        </Dialog>
        </div>
        <div style={{width:"50 vw"}}>
            <MaterialTable title="Patient Table"
            style={{minHeight:"50vh",border:"5px solid aqua"}}
            data={data}
            columns={columns}
            components={{
                Row: props => (<CustomRow {...props} />
                )
            }}
            options={{
                paging:true,
                actionsColumnIndex: -1, addRowPosition: "first"
            }}
            editable={{
                onRowDelete:  selectedRow =>  new Promise((resolve,reject) => {
                    const queryObj = JSON.stringify({
                        patientId:selectedRow._id
                    })
                    console.log("query Obj:",queryObj)
                    var authenticated = checkAuth(doctorJwt).then(function(result) {
                        console.log(result)
                     })
                    //if the user is validate the deletion code goes through
                    if(authenticated){
                        deletePatient(selectedRow._id).then(function(result) {
                            if(result.error === "Not Found" && result.statusCode === 404){
                                alert("patient Not found")
                            }else if(result.message === "Deletion Success") {
                                setAutoFreeze(false);
                                console.log("patient found",result.Response.Firstname ,result.Response.Lastname)

                                //after successful query instead of querying again for the patient list , we delete the local storage of patientlist and dispatch the new list to the patient store

                                var newData = data.filter((item) => item._id !== result.Response._id);
                                console.log("newTable:",newData)
                                setData(newData)
                                dispatch(populatePatientDetail(newData))
                                setTimeout(() => {
                                    
                                    resolve()
                                }, 2000)
                            }
                         })
                        
                    }
                    else{
                        console.log("failed")
                    }
                })
            }}
            actions={[
                {
                  icon: 'add',
                  tooltip: 'Add User',
                  isFreeAction: true,
                  onClick: (event) => addPatientDialogToggle()
                }
            ]}
            />
        </div>
      </>
    );
  }
  
  export default Table;