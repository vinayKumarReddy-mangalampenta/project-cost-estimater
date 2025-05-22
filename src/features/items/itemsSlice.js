import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
	collection,
	addDoc,
	deleteDoc,
	doc,
	updateDoc,
	getDocs,
	query,
	where,
} from "firebase/firestore";
import { db } from "../../firebase/config";

// Fetch all items for a user
export const fetchItems = createAsyncThunk(
	"items/fetchItems",
	async (userId, { rejectWithValue }) => {
		try {
			const itemsRef = collection(db, "users", userId, "items");
			const snapshot = await getDocs(itemsRef);

			const items = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));

			return items;
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
);

// Add a new item
export const addItem = createAsyncThunk(
	"items/addItem",
	async ({ userId, item }, { rejectWithValue }) => {
		try {
			const itemsRef = collection(db, "users", userId, "items");
			const docRef = await addDoc(itemsRef, {
				...item,
				createdAt: new Date().toISOString(),
			});

			return {
				id: docRef.id,
				...item,
				createdAt: new Date().toISOString(),
			};
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
);

// Update an existing item
export const updateItem = createAsyncThunk(
	"items/updateItem",
	async ({ userId, itemId, updatedItem }, { rejectWithValue }) => {
		try {
			const itemRef = doc(db, "users", userId, "items", itemId);
			await updateDoc(itemRef, updatedItem);

			return {
				id: itemId,
				...updatedItem,
			};
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
);

// Delete an item
export const deleteItem = createAsyncThunk(
	"items/deleteItem",
	async ({ userId, itemId }, { rejectWithValue }) => {
		try {
			const itemRef = doc(db, "users", userId, "items", itemId);
			await deleteDoc(itemRef);

			return itemId;
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
);

const initialState = {
	items: [],
	isLoading: false,
	error: null,
};

const itemsSlice = createSlice({
	name: "items",
	initialState,
	reducers: {
		clearItemsError: (state) => {
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder
			// Fetch items
			.addCase(fetchItems.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(fetchItems.fulfilled, (state, action) => {
				state.items = action.payload;
				state.isLoading = false;
			})
			.addCase(fetchItems.rejected, (state, action) => {
				state.error = action.payload;
				state.isLoading = false;
			})
			// Add item
			.addCase(addItem.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(addItem.fulfilled, (state, action) => {
				state.items.push(action.payload);
				state.isLoading = false;
			})
			.addCase(addItem.rejected, (state, action) => {
				state.error = action.payload;
				state.isLoading = false;
			})
			// Update item
			.addCase(updateItem.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(updateItem.fulfilled, (state, action) => {
				const index = state.items.findIndex(
					(item) => item.id === action.payload.id
				);
				if (index !== -1) {
					state.items[index] = action.payload;
				}
				state.isLoading = false;
			})
			.addCase(updateItem.rejected, (state, action) => {
				state.error = action.payload;
				state.isLoading = false;
			})
			// Delete item
			.addCase(deleteItem.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(deleteItem.fulfilled, (state, action) => {
				state.items = state.items.filter((item) => item.id !== action.payload);
				state.isLoading = false;
			})
			.addCase(deleteItem.rejected, (state, action) => {
				state.error = action.payload;
				state.isLoading = false;
			});
	},
});

export const { clearItemsError } = itemsSlice.actions;
export default itemsSlice.reducer;
