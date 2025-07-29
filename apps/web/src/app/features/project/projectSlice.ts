import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ProjectState } from "../../types/state.type";
import { projectAPI } from "./projectAPI";
import { ProjectProps } from "../../../../../../libs/domain/entities/project.entity";



const initialState :ProjectState = {
    projects: null,
    isLoading: false,
      fetchError: null,
  createError: null,
}

export const fetchProjectsThunk = createAsyncThunk("project/fetch", async (filter: any, thunkAPI) => {
    try {
        const res = await projectAPI.getAllProjects(filter);
        console.log(res.data.projects)
        return res.data.projects;
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.response.data.message)
    }
});
export const createProjectThunk = createAsyncThunk("project/create", async (data: Partial<ProjectProps>, thunkAPI) => {
    try {
        const res = await projectAPI.create(data);
        console.log(res.data.project)
        return res.data.project;
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.response.data.message)
    }
});


export const projectSlice = createSlice({
    name: "project",
    initialState,
    reducers: {
        
    },
    extraReducers: builder => {
        builder.addCase(fetchProjectsThunk.pending, (state) => {
                state.isLoading = true;
                state.fetchError = null;
              })
              .addCase(fetchProjectsThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.projects = action.payload;
              })
              .addCase(fetchProjectsThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.fetchError = action.payload as string;
              })
            .addCase(createProjectThunk.pending, (state) => {
                state.isLoading = true;
                state.createError = null;
              })
              .addCase(createProjectThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.projects =[...(state.projects||[]), action.payload];
              })
              .addCase(createProjectThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.createError = action.payload as string;
              });
    }
})


export default projectSlice.reducer;