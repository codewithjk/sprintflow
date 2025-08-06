import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { taskAPI } from "./taskAPI";
import { TaskProps } from "../../../../../../libs/domain/entities/task.entity";
import { TaskState } from "../../types/state.type";



const initialState: TaskState = {
    tasks: null,
    fetchError: null,
    createError: null,
    updateError: null,
    deleteError: null,
    fetchLoading: false,
    createLoading: false,
    updateLoading: false,
    deleteLoading: false,
}

export const fetchTasksThunk = createAsyncThunk("task/fetch", async (filter: Partial<TaskProps> & { page: number, limit: number }, thunkAPI) => {
    try {
        const res = await taskAPI.searchTasks(filter);
        return res.data.tasks;
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.response.data.message)
    }
});
export const createTaskThunk = createAsyncThunk("task/create", async (data: Partial<TaskProps>, thunkAPI) => {
    try {
        const res = await taskAPI.create(data);
        console.log(res.data.task)
        return res.data.task;
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.response.data.message)
    }
});

export const updateTaskThunk = createAsyncThunk("task/update", async ({ taskId, data }: { taskId: string, data: Partial<TaskProps> }, thunkAPI) => {
    try {
        const res = await taskAPI.update(taskId, data);
        console.log(res.data.task)
        return res.data.task;
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.response.data.message)
    }
});
export const deleteTaskThunk = createAsyncThunk(
    "task/delete",
    async (taskId: string, thunkAPI) => {
        try {
            await taskAPI.delete(taskId);
            return taskId; // return the deleted task's ID
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response.data.message);
        }
    }
);


export const taskSlice = createSlice({
    name: "task",
    initialState,
    reducers: {

    },
    extraReducers: builder => {
        builder.addCase(fetchTasksThunk.pending, (state) => {
            state.fetchLoading = true;
            state.fetchError = null;
        }).addCase(fetchTasksThunk.fulfilled, (state, action) => {
                state.fetchLoading = false;
                state.tasks = action.payload;
            })
            .addCase(fetchTasksThunk.rejected, (state, action) => {
                state.fetchLoading = false;
                state.fetchError = action.payload as string;
            })
            .addCase(createTaskThunk.pending, (state) => {
                state.createLoading = true;
                state.createError = null;
            })
            .addCase(createTaskThunk.fulfilled, (state, action) => {
                state.createLoading = false;
                state.tasks = [...(state.tasks || []), action.payload];
            })
            .addCase(createTaskThunk.rejected, (state, action) => {
                state.createLoading = false;
                state.createError = action.payload as string;
            }).addCase(updateTaskThunk.pending, (state) => {
                state.updateLoading = true;
                state.updateError = null;
            })
            .addCase(updateTaskThunk.fulfilled, (state, action) => {
                state.updateLoading = false;
                if (state.tasks) {
                    state.tasks = state.tasks.map(task =>
                        task.id === action.payload.id ? action.payload : task
                    );
                }
            })
            .addCase(updateTaskThunk.rejected, (state, action) => {
                state.updateLoading = false;
                state.updateError = action.payload as string;
            })
            .addCase(deleteTaskThunk.pending, (state) => {
                state.deleteLoading = true;
                state.deleteError = null;
            })
            .addCase(deleteTaskThunk.fulfilled, (state, action) => {
                state.deleteLoading = false;
                if (state.tasks) {
                    state.tasks = state.tasks.filter(task => task.id !== action.payload);
                }
            })
            .addCase(deleteTaskThunk.rejected, (state, action) => {
                state.deleteLoading = false;
                state.deleteError = action.payload as string;
            })

    }
})


export default taskSlice.reducer;