import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import GitHubStore from "@store/GitHubStore";
import { ApiResp, RepoItem } from "@store/GitHubStore/types";

type initialStateProps = {
  value: string;
  load: boolean;
  result: ApiResp<RepoItem> | null;
  disabled: boolean;
  owner: string;
  repo: string;
  visible: boolean;
  page: number;
  hasMore: boolean;
};

const initialState: initialStateProps = {
  value: "",
  load: true,
  result: null,
  disabled: false,
  owner: "",
  repo: "",
  visible: false,
  page: 20,
  hasMore: true,
};

const gitHubStore = new GitHubStore();

export const getReposList = createAsyncThunk(
  "repos/getReposList",
  async (params: { value: string; page: number; load: boolean }) => {
    if (!params.load) return;
    const response = await gitHubStore.getOrganizationReposList(
      { organizationName: params.value },
      params.page
    );
    return response;
  }
);

export const getNextReposList = createAsyncThunk(
  "repos/getNextReposList",
  async ({ value, page }: { value: string; page: number }) => {
    const response = await gitHubStore.getOrganizationReposList(
      { organizationName: value },
      page
    );
    return response;
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
      for (let item of state.result?.data.data.organization.repositories
        .nodes) {
        if (parseInt(action.payload.id) === item.databaseId) {
          state.owner = item.owner.login;
          state.repo = item.name;
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
        state.load = false;
      })
      .addCase(getReposList.fulfilled, (state, action) => {
        state.result = action.payload !== undefined ? action.payload : null;
        state.disabled = false;
        state.load = true;
        state.page += 20;
      })
      .addCase(getNextReposList.pending, (state, action) => {
        state.disabled = false;
        state.load = false;
      })
      .addCase(getNextReposList.fulfilled, (state, action) => {
        state.disabled = false;
        state.load = true;
        if (action.payload === undefined) return;
        state.result = {
          status: action.payload.status,
          data: state.result?.data
            ? {
                data: {
                  organization: {
                    repositories: {
                      nodes:
                        state.result?.data.data.organization.repositories.nodes.concat(
                          action.payload.data.data.organization.repositories
                            .nodes
                        ),
                    },
                  },
                },
              }
            : action.payload.data,
          success: action.payload.success,
        };
        state.page += 20;
        if (
          (state.result
            ? state.result.data.data.organization.repositories.nodes.length
            : 0) /
            10 <
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
