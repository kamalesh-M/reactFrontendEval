import {  Button ,TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import Select from 'react-select'
import { useSelector } from "react-redux";
import {React, useEffect, useMemo , useState } from 'react';
import {createNewPatient} from"../redux/patientDetail";
import { useDispatch } from "react-redux";
import './App.css';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input'
import { editPatient } from '../redux/patientDetail';
import countryList from 'react-select-country-list'
import 'react-phone-number-input/style.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-toastify/dist/ReactToastify.css';
import './form.css'
import './newPatient.css'

import {
    Dialog,
    DialogContent,
    DialogTitle
  }from '@mui/material'
import './phoneNumber.css'
const useStyle = makeStyles( theme => ({
    nameField:{
        "& .MuiFormControl-root":{
            width: '12vw',
            marginRight: '45px',
            height: '5px'
        }
    }
}))
const initialValues={
    Firstname: "",
    Lastname: "",
    Middlename: "",
    phoneNumber: "",
    email: "",
    Address: "",
    weight: '',
    height: '',
    country: '',
    state: '',
    zipcode: ''
}

function PatientForm(props) {
    const PatientDialogMethod = props.dialogMethod
    const EditPatientId = props.patientId
    const dispatch = useDispatch()
    const[fname,setFname] = useState('')
    const [value, setValue] = useState()
    const { user } = useSelector((state) => state.user)
    const doctorId = user.doctorId
    const doctorJwt = user.access_token
    const [values,setValues] = useState(initialValues);
    const [address,setAddress] = useState('');
    const [state,setState] = useState('');
    const [zip_code,setZip_code] = useState('');
    const [newAddedPatient,setNewAddedPatient] = useState([]);
    const [openConfirmSave,setOpenConfirmSave] = useState(false);
    const [Countryvalue, setCountryvalue] = useState({
        value:'',
        label:''
    })
    useEffect(() => {
        if(props.dialogMethod && props.dialogMethod === "EDIT"){
            console.log("**************",props.EditObj)
            setValues({
                Firstname: props.EditObj.Firstname,
                Lastname: props.EditObj.Lastname,
                Middlename: props.EditObj.Middlename,
                phoneNumber: "",
                email: props.EditObj.email,
                Address: props.EditObj.Address,
                weight: props.EditObj.weight,
                height: props.EditObj.height,
                country: props.EditObj.country,
                state: props.EditObj.state,
                zipcode: props.EditObj.zipcode
            })
            setCountryvalue({
                ...Countryvalue,
                label:props.EditObj.country}
            )
            console.log("////////////",values)
        }
    },[])
    const countryOptions = useMemo(() => countryList().getData(), [])
    const classes = useStyle();
    const handleInputChange = e => {
        var name = e.target.name
        var value = e.target.value
        setValues({
            ...values,
            [name]:value
        })
    }
    
    const countrySelectHandler = value => {
        setValues({
            ...values,
            country:value.label
        })
        setCountryvalue(value)
    }
    const addressInputHandler = e => {
        var value = e.target.value
        setAddress(value) 
    }
    const zipCodeInputHandler = e => {
        var value = e.target.value
        setZip_code(value) 
    }
    const stateInputHandler = e => {
        var value = e.target.value
        setState(value) 
    }
    const WeightInputHandler = e => {

        // since th etextfield only return string we are converting the input to number
        var value = e.target.value
        setValues({
            ...values,
            weight:Number(value)
        }) 
    }
    const HeightInputHandler = e => {

        // since th etextfield only return string we are converting the input to number
        var value = e.target.value
        setValues({
            ...values,
            height:Number(value)
        }) 
    }
    
    const formSubmitHandler = value => {
      value.preventDefault();
      var phoneFlag = true;
      var addressCondition = false;
      if(values.Address.length > 0 && Countryvalue.label.length > 0 && values.state.length > 0 && values.zipcode.length > 0){
    
        setValues({
            ...values,
            country:Countryvalue.label
        }) 
        addressCondition = true
      }
      else {
        addressCondition = false
            console.log("missing address field")
        }
      if(values.phoneNumber.length > 0){
        phoneFlag = isValidPhoneNumber(values.phoneNumber)
        console.log("checking phone flag",phoneFlag,values.phoneNumber)
      }
      else{
        console.log("enter phone number")
      }

      if(addressCondition === true && phoneFlag === true && values.Firstname.length > 0 && values.Lastname.length > 0 && values.Middlename.length >0
        && values.phoneNumber.length > 0 && values.email.length > 0 && values.weight > 0  && values.height > 0){
            console.log("valid form",values)
            const queryObj = JSON.parse(JSON.stringify(values));
            queryObj.Doctor = doctorId
            console.log("queryObje:",queryObj)
            //checking whether the user is valid by passign the jwt token to the server and match it
            var authenticated = checkAuth(doctorJwt).then(function(result) {
                console.log(result)
                console.log("authenticated ?:",authenticated)
             })
             if(authenticated){
                console.log("authenticated")
                if(PatientDialogMethod && PatientDialogMethod === "CREATE"){
                    createPatientApiCall(queryObj).then(function(result) {
                        console.log("checking create patient response",result)
                        if(result.message === "patient created" && result.status === '200' ){
                            console.log("result.patient:",result.patient)
                            //store the new patient list in the store so that we can avoid fetching the data backend again
                            dispatch(createNewPatient(result.patient))
                            newAddedPatient.push(result.patient)
                            setFname(result.patient.Firstname)
                            toast.success('Successfully created a patient !', {
                                position: toast.POSITION.TOP_RIGHT
                            });
                            setOpenConfirmSave(true)
                        }
                    })
                }
                else if(PatientDialogMethod && PatientDialogMethod === "EDIT" && EditPatientId && EditPatientId.length > 0){
                    
                    EditPatientApiCall(queryObj,EditPatientId).then(function(result) {
                        console.log("checking Edit patient response",result)
                        if(result.message === "patient Edited" && result.status === '200' ){
                            console.log("result.patient:",result.patient)
                            //store the new edited patient list in the store so that we can avoid fetching the data backend again
                            toast.success('Success Edited !', {
                                position: toast.POSITION.TOP_RIGHT
                            });
                            dispatch(editPatient(result.patient))
                            //props.closeHandler()
                           
                            
                        }
                    })
                }
             }
             else{
                console.log("unauthorized user")
             }
            
        }
      else{ 
            toast.warning('enter all fields correctly!', {
                position: toast.POSITION.TOP_RIGHT
            });
            console.log("invalid form",values)
      }
      
    }

    async function closePatientDisplay(){
           setNewAddedPatient([])
           props.closeHandler()
           setOpenConfirmSave(false)
           console.log("checking newly added patient array:",newAddedPatient)
    }
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
    async function EditPatientApiCall(queryObj,patientId){
        var createObj;
        await fetch(`http://localhost:8000/patient/${EditPatientId}`, {   
            // Adding method type
            method: "PATCH",
            // Adding body or contents to send
            body: JSON.stringify(queryObj),
            // Adding headers to the request
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
          })
        .then(response => response.json())
        .then(json =>  createObj = json)
        return createObj;
    }
    async function createPatientApiCall(queryObj){
        var createObj;
        await fetch("http://localhost:8000/patient", {   
            // Adding method type
            method: "POST",
            // Adding body or contents to send
            body: JSON.stringify(queryObj),
            // Adding headers to the request
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
          })
        .then(response => response.json())
        .then(json =>  createObj = json)
        return createObj;
    }
  return (
    <div>
        <ToastContainer />
        <form>
            <h1 className='formHeader' style={{marginTop:"10px",marginRight:'15px'}}>Name</h1>
            <div className={classes.nameField} style={{display:'flex',height: '50px'}}>
                <TextField
                required
                size="small"
                variant='standard'
                label="First name"
                name="Firstname"
                value={values.Firstname}
                onChange={handleInputChange}
                />
                <TextField
                size="small"
                variant='standard'
                label="Middle name"
                name="Middlename"
                value={values.Middlename}
                onChange={handleInputChange}
                />
                <TextField
                size="small"
                variant='standard'
                label="Last name"
                name="Lastname"
                value={values.Lastname}
                onChange={handleInputChange}
                />
            </div>
            <h1 className='formHeader' style={{marginTop:"15px",marginRight:'15px'}}>Email :</h1>
            <div  style={{marginTop:'5px',display:'flex'}}>
            <TextField
                variant='standard'
                fullWidth 
                label="Email"
                name="email"
                value={values.email}
                onChange={handleInputChange}
                />
            </div>
            <h1 className='formHeader' style={{marginTop:'15px'}}>Address</h1>
            <div style={{marginTop:'15px',display:'flex'}}>       
            <TextField
                fullWidth
                variant='standard'
                label="Address"
                name="Address"
                value={values.Address}
                onChange={handleInputChange}
            />
            </div>
            <div style={{marginTop:'45px',display:'flex'}}>
            <h1 className='formHeader' style={{marginRight:'15px'}}>Country :</h1>
            <div style={{width:"250px",marginLeft:"25px"}}>
                <Select
                options={countryOptions} 
                value={Countryvalue} 
                onChange={countrySelectHandler}
                ></Select>
             </div>
            </div>
            <div style={{marginTop:'45px',display:'flex'}}>

            {Countryvalue && (
            <div>
                <h1 className='formHeader' style={{marginRight:'15px'}}>State</h1>
                <TextField
                    style={{marginRight:'45px'}}
                    variant='standard'
                    size="small"
                    label="state"
                    name="state"
                    value={values.state}
                    onChange={handleInputChange}
                />
                <TextField
                    variant='standard'
                    size="small"
                    label="zipcode"
                    name="zipcode"
                    value={values.zipcode}
                    onChange={handleInputChange}
                />
             </div>
            )}
            </div>
            <div style={{marginTop:'40px',display:'flex'}}>
            <h1 className='formHeader' style={{marginRight:'15px'}}>Phone :</h1>
            <div style={{marginLeft:"25px"}}>
                <PhoneInput
                className="PhoneInputInput"
                international
                defaultCountry={Countryvalue.value}
                value={value}
                onChange={value => setValues({...values,phoneNumber:value})} />
             </div>
            </div>
            <p>Is valid: {values.phoneNumber && isValidPhoneNumber(values.phoneNumber) ? 'true' : 'false'}</p>
            <div style={{marginTop:'25px',display:'flex'}}>
            <TextField
                type={"number"}
                size="small"
                variant='standard'
                label="Weight in kgs"
                name="weight"
                value={values.weight}
                onChange={WeightInputHandler}
                style = {{width: '100px', marginRight: '45px'}}
                />
            <TextField
                type="number"
                size="small"
                variant='standard'
                label="Height in fts"
                name="height"
                value={values.height}
                onChange={HeightInputHandler}
                style = {{width: '100px'}}
                />
            </div>
            <div>
            <p>{ PatientDialogMethod === "EDIT" ?  
            <Button variant="contained"  style = {{marginTop: '75px',marginBottom:'25px',width:'100%',backgroundColor:'#588B8B',color:'whitesmoke'}} onClick={formSubmitHandler}>Edit</Button> :  
            <Button variant="contained"  style = {{marginTop: '75px',marginBottom:'25px',width:'100%',backgroundColor:'#588B8B',color:'whitesmoke'}} onClick={formSubmitHandler}>SUBMIT</Button>}</p>
               
            </div>
        </form>
        <Dialog open={openConfirmSave} PaperProps={{ style: {
        minHeight: '60%',
        maxHeight: '60%',
        minWidth: '500px'
        }}}>
        <DialogTitle>
          <div style={{justifyContent:"space-between",display:"flex"}}>
          <Button onClick={closePatientDisplay} style={{background: "red",color:"white"}} className="CloseButton">X</Button>
          </div>
        </DialogTitle>
        <DialogContent>
        {newAddedPatient.map((patient) => {

          return <>
          <div key={patient._id} style={{padding:'20px'}}>
            <p className='newPatientForm' ><span  className='Heading'>First Name:</span> {patient.Firstname}</p>
            <p className='newPatientForm' ><span  className='Heading'>Last Name:</span>  {patient.Lastname}</p>
            <p className='newPatientForm' ><span  className='Heading'>Middle Name:</span>  {patient.Middlename}</p>
            <p className='newPatientForm' ><span  className='Heading'>Address:</span> {patient.Address}{patient.country} {patient.state} {patient.zipcode}</p>
            <p className='newPatientForm' ><span  className='Heading'>Email:</span> {patient.email}</p>
            <p className='newPatientForm' ><span  className='Heading'>Address:</span> {patient.phoneNumber}</p>
          <div style={{display:'flex',justifyContent:"space-between"}}><p className='newPatientForm' ><span  className='Heading'>Height:</span> {patient.height}</p><p className='newPatientForm' ><span  className='Heading'>Weight:</span> {patient.weight}</p></div>
          </div>
          </>
          
        })}

        </DialogContent>
      </Dialog>
    </div>
  );
}

export default PatientForm;