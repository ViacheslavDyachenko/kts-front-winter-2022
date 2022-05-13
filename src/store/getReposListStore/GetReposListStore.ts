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
  hasMore: boolean | undefined;
  endCursor: string | undefined;
  branchesList: string[][] | undefined;
};

const initialState: initialStateProps = {
  value: "",
  load: false,
  result: null,
  disabled: false,
  owner: "",
  repo: "",
  visible: false,
  hasMore: true,
  endCursor: undefined,
  branchesList: undefined,
};

const gitHubStore = new GitHubStore();

export const getReposList = createAsyncThunk(
  "repos/getReposList",
  async (params: {
    value: string;
    load: boolean;
    endCursor: string | undefined;
  }) => {
    if (!params.load) return;
    const response = await gitHubStore.getOrganizationReposList(
      { organizationName: params.value },
      params.endCursor
    );
    return response;
  }
);

export const getNextReposList = createAsyncThunk(
  "repos/getNextReposList",
  async ({
    value,
    endCursor,
  }: {
    value: string;
    page: number;
    endCursor: string | undefined;
  }) => {
    const response = await gitHubStore.getOrganizationReposList(
      { organizationName: value },
      endCursor
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
      state.hasMore = action.payload.hasMore;
      state.result = null;
      state.endCursor = undefined;
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
      })
      .addCase(getReposList.fulfilled, (state, action) => {
        state.result = action.payload !== undefined ? action.payload : null;
        state.disabled = false;
        state.load = false;
        action.payload?.data.data.organization !== null
          ? (state.endCursor =
              action.payload?.data.data.organization.repositories.pageInfo.endCursor)
          : (state.endCursor = undefined);
        action.payload?.data.data.organization !== null
          ? (state.hasMore =
              action.payload?.data.data.organization.repositories.pageInfo.hasNextPage)
          : (state.hasMore = undefined);
        action.payload?.data.data.organization !== null
          ? (state.branchesList =
              action.payload?.data.data.organization.repositories.nodes.map(
                (item) => {
                  return item.commitComments.nodes.map((childItem) => {
                    return childItem.commit.message;
                  });
                }
              ))
          : (state.branchesList = undefined);
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
                      pageInfo:
                        state.result.data.data.organization.repositories
                          .pageInfo,
                    },
                  },
                },
              }
            : action.payload.data,
          success: action.payload.success,
        };
        state.endCursor =
          action.payload?.data.data.organization.repositories.pageInfo.endCursor;
        state.hasMore =
          action.payload?.data.data.organization.repositories.pageInfo.hasNextPage;
        state.branchesList =
          action.payload?.data.data.organization.repositories.nodes.map(
            (item) => {
              return item.commitComments.nodes.map((childItem) => {
                return childItem.commit.message;
              });
            }
          );
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
