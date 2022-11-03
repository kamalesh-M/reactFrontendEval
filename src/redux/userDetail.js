import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: [],
}

export const UserSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    populateUserDetail: (state, action) => {
      console.log('user before pushed',state.user)
      return { 
        ...state, //spreading the original state
        user: action.payload
       }
      
    }
  },
})

// Action creators are generated for each case reducer function
export const { populateUserDetail } = UserSlice.actions

export default UserSlice.reducer