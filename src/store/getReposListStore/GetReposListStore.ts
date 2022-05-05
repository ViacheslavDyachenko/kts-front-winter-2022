import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import GitHubStore from "@store/GitHubStore";
import { ApiResp, RepoItem } from "@store/GitHubStore/types";

type initialStateProps = {
  value: string;
  load: boolean;
  result: ApiResp<RepoItem[]> | null;
  disabled: boolean;
  owner: string;
  repo: string;
  visible: boolean;
  page: number;
  hasMore: boolean;
};

const initialState: initialStateProps = {
  value: "",
  load: false,
  result: null,
  disabled: false,
  owner: "",
  repo: "",
  visible: false,
  page: 1,
  hasMore: true,
};

const gitHubStore = new GitHubStore();

export const getReposList = createAsyncThunk(
  "repos/getReposList",
  async ({
    value,
    page,
    load,
  }: {
    value: string;
    page: number;
    load: boolean;
  }) => {
    if (!load) return;
    return await gitHubStore.getOrganizationReposList(
      { organizationName: value },
      page
    );
  }
);

export const getNextReposList = createAsyncThunk(
  "repos/getNextReposList",
  async ({ value, page }: { value: string; page: number }) => {
    return await gitHubStore.getOrganizationReposList(
      { organizationName: value },
      page
    );
  }
);

const getReposListStore = createSlice({
  name: "repos",
  initialState,
  reducers: {
    onChangeReduxHandler(state, action) {
      state.value = action.payload.value;
    },
    onClickReduxHandler(state, action) {
      state.load = action.payload.load;
      state.page = action.payload.page;
      state.hasMore = action.payload.hasMore;
    },
    showDrawerReduxHandler(state, action) {
      if (!state.result) return;
      for (let item of state.result?.data) {
        if (parseInt(action.payload.elem.id) === parseInt(item.item.id)) {
          state.owner = item.owner;
          state.repo = item.item.title;
        }
      }
      state.visible = true;
    },
    onCloseReduxHandler(state) {
      state.visible = false;
    },
    getParamsReduxHandler(state, action) {
      state.repo =
        action.payload.title !== undefined ? action.payload.title : "";
      state.owner =
        action.payload.company !== undefined ? action.payload.company : "";
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getReposList.pending, (state, action) => {
        state.disabled = true;
      })
      .addCase(getReposList.fulfilled, (state, action) => {
        state.result = action.payload !== undefined ? action.payload : null;
        state.disabled = false;
        state.load = false;
        state.page += 1;
      })
      .addCase(getNextReposList.pending, (state, action) => {
        state.disabled = false;
      })
      .addCase(getNextReposList.fulfilled, (state, action) => {
        state.disabled = false;
        state.load = false;
        if (action.payload === undefined) return;
        state.result = {
          status: action.payload.status,
          data: state.result
            ? state.result.data.concat(action.payload.data)
            : action.payload.data,
          success: action.payload.success,
        };
        state.page += 1;
        if (
          (state.result ? state.result.data.length : 0) / 10 <
          state.page - 1
        ) {
          state.hasMore = false;
        }
      });
  },
});

export const {
  onChangeReduxHandler,
  onClickReduxHandler,
  showDrawerReduxHandler,
  onCloseReduxHandler,
  getParamsReduxHandler,
} = getReposListStore.actions;

export default getReposListStore.reducer;
