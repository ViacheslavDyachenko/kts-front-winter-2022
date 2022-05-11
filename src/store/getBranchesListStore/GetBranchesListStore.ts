import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import GitHubStore from "@store/GitHubStore";
import { BranchesItem } from "@store/GitHubStore/types";

type initialStateProps = {
  branches: BranchesItem[] | null;
  isLoading: boolean;
  isError: boolean;
};

const initialState: initialStateProps = {
  branches: null,
  isLoading: false,
  isError: false,
};

const gitHubStore = new GitHubStore();

export const getBranchesList = createAsyncThunk(
  "branches/getBranchesList",
  async (params: {
    isLoading: boolean;
    company: string | undefined;
    title: string | undefined;
  }) => {
    let response;
    if (!params.isLoading && params.company && params.title) {
      response = gitHubStore.getBranchList({
        ownerName: params.company,
        reposName: params.title,
      });
    }
    return response;
  }
);

const GetBranchesListStore = createSlice({
  name: "branches",
  initialState,
  reducers: {
    closeDrawer(state) {
      state.isLoading = false;
      state.isError = false;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getBranchesList.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getBranchesList.fulfilled, (state, action) => {
        if (action.payload !== undefined) {
          action.payload.success
            ? (state.branches = action.payload.data)
            : (state.isError = true);
        }
        state.isLoading = false;
      });
  },
});

export const { closeDrawer } = GetBranchesListStore.actions;

export default GetBranchesListStore.reducer;
