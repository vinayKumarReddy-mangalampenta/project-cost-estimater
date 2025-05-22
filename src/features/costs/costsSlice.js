import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  updateDoc, 
  getDocs 
} from 'firebase/firestore';
import { db } from '../../firebase/config';

// Fetch all other costs for a user
export const fetchCosts = createAsyncThunk(
  'costs/fetchCosts',
  async (userId, { rejectWithValue }) => {
    try {
      const costsRef = collection(db, 'users', userId, 'otherCosts');
      const snapshot = await getDocs(costsRef);
      
      const costs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      return costs;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Add a new cost
export const addCost = createAsyncThunk(
  'costs/addCost',
  async ({ userId, cost }, { rejectWithValue }) => {
    try {
      const costsRef = collection(db, 'users', userId, 'otherCosts');
      const docRef = await addDoc(costsRef, {
        ...cost,
        createdAt: new Date().toISOString()
      });
      
      return {
        id: docRef.id,
        ...cost,
        createdAt: new Date().toISOString()
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update an existing cost
export const updateCost = createAsyncThunk(
  'costs/updateCost',
  async ({ userId, costId, updatedCost }, { rejectWithValue }) => {
    try {
      const costRef = doc(db, 'users', userId, 'otherCosts', costId);
      await updateDoc(costRef, updatedCost);
      
      return {
        id: costId,
        ...updatedCost
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete a cost
export const deleteCost = createAsyncThunk(
  'costs/deleteCost',
  async ({ userId, costId }, { rejectWithValue }) => {
    try {
      const costRef = doc(db, 'users', userId, 'otherCosts', costId);
      await deleteDoc(costRef);
      
      return costId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  costs: [],
  isLoading: false,
  error: null
};

const costsSlice = createSlice({
  name: 'costs',
  initialState,
  reducers: {
    clearCostsError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch costs
      .addCase(fetchCosts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCosts.fulfilled, (state, action) => {
        state.costs = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchCosts.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })
      // Add cost
      .addCase(addCost.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addCost.fulfilled, (state, action) => {
        state.costs.push(action.payload);
        state.isLoading = false;
      })
      .addCase(addCost.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })
      // Update cost
      .addCase(updateCost.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCost.fulfilled, (state, action) => {
        const index = state.costs.findIndex(cost => cost.id === action.payload.id);
        if (index !== -1) {
          state.costs[index] = action.payload;
        }
        state.isLoading = false;
      })
      .addCase(updateCost.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })
      // Delete cost
      .addCase(deleteCost.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteCost.fulfilled, (state, action) => {
        state.costs = state.costs.filter(cost => cost.id !== action.payload);
        state.isLoading = false;
      })
      .addCase(deleteCost.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      });
  }
});

export const { clearCostsError } = costsSlice.actions;
export default costsSlice.reducer;