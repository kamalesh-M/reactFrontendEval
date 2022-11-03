import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  patient: [],
}

export const PatientSlice = createSlice({
  name: 'patient',
  initialState,
  reducers: {
    populatePatientDetail: (state, action) => {
      console.log("payload",action.payload)
      return { 
        ...state, //spreading the original state
        patient: action.payload
       }
      
    },
    createNewPatient: (state, action) => {
      console.log("check the payload:",action.payload)
      state.patient.push(action.payload);
      
    },
    editPatient: (state, action) => {
      console.log("check the payload in edit:",action.payload)
      
      
    }
  },
})

// Action creators are generated for each case reducer function
export const { populatePatientDetail,createNewPatient,editPatient } = PatientSlice.actions

export default PatientSlice.reducer