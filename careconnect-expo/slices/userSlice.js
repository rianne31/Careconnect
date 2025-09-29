import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  name: '',
  user: {
    name: 'Test User',
    tier: 'Bronze',
    badges: ['First Donor'],
    streak: 5,
    recommendations: []
  }
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setName: (state, action) => {
      state.name = action.payload;
    },
  },
});

export const { setName } = userSlice.actions;
export default userSlice.reducer; 