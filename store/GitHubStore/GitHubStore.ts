import ApiStore from "shared/store/ApiStore";
import { ApiResponse, HTTPMethod } from "shared/store/ApiStore/types";

import {
  ApiResp,
  BranchesItem,
  CreateReposParams,
  GetBranchListParams,
  GetOrganizationReposListParams,
  IGitHubStore,
  RepoItem,
} from "./types";

export default class GitHubStore implements IGitHubStore {
  private readonly _apiStore = new ApiStore("https://api.github.com");
  private readonly _apiStoreAuth = new ApiStore("https://github.com"); // TODO: не забудьте передать baseUrl в конструктор

  // TODO: реализовать интерфейс IGitHubStore

  async getOrganizationReposList(
    params: GetOrganizationReposListParams,
    endCursor: string | undefined
  ): Promise<ApiResp<RepoItem> | undefined> {
    try {
      const response = await this._apiStore.request({
        method: HTTPMethod.POST,
        endpoint: `/graphql`,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "bearer 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",
        },
        data: {
          query: `query nextPage($company: String!, $endCursor: String) {
            organization(login: $company) {
              repositories(first: 20, after: $endCursor) {
                nodes {
                  commitComments(first: 10) {
                    nodes {
                      commit {
                        message
                      }
                    }
                  }
                  databaseId
                  owner {
                    avatarUrl(size: 80)
                    login
                  }
                  name
                  stargazerCount
                  updatedAt
                },
                pageInfo {
                  endCursor
                  hasNextPage
                }
              }
            },
          },`,
          variables: { company: params.organizationName, endCursor },
        },
      });
      return {
        success: response.success,
        data: response.data,
        status: response.status,
      };
    } catch (e) {
      //eslint-disable-next-line
      console.log(e);
    }
  }

  async getBranchList(
    params: GetBranchListParams
  ): Promise<ApiResp<BranchesItem[]>> {
    let response = await this._apiStore.request<
      ApiResponse<BranchesItem, BranchesItem>
    >({
      method: HTTPMethod.GET,
      endpoint: `/repos/${params.ownerName}/${params.reposName}/branches`,
      headers: {},
    });
    try {
      response.data = await response.data.map((item: any) => ({
        id: item.commit.sha,
        name: item.name,
      }));
    } catch (e) {
      return {
        success: response.success,
        data: response.data,
        status: response.status,
      };
    }
    return {
      success: response.success,
      data: response.data,
      status: response.status,
    };
  }

  async createRepos(params: CreateReposParams): Promise<ApiResp<{}>> {
    const clientID = "ebac1c599a2b6c661bbb";
    const clientSecret = "84959d8866d4a5dadd51a26e7d3c0bb840cecfe9";
    const authorize_uri = "https://github.com/login/oauth/authorize";
    const redirect_uri = "http://localhost:3000";
    let codeParam = window.location.search.replace("?code=", "");
    if (codeParam === "") {
      window.location.href = `${authorize_uri}?client_id=${clientID}&redirect_uri=${redirect_uri}`;
      codeParam = window.location.search.replace("?code=", "");
    }
    // это не сработает так как отправлять ID и Secret клиента в браузерном приложении нельзя, произойдёт ошибка CORS policy.
    // как реализовать получение access token на фронте не знаю, сломал голову, перепробовал много различных гайдов.
    const tokenResponse = await this._apiStoreAuth.request({
      method: HTTPMethod.POST,
      endpoint:
        "/login/oauth/access_token?" +
        `client_id=${clientID}&` +
        `client_secret=${clientSecret}&` +
        `code=${codeParam}`,
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    const accessToken = tokenResponse.data.access_token;

    const result = await this._apiStore.request({
      method: HTTPMethod.POST,
      endpoint: `/orgs/${params.organizationName}/repos`,
      headers: {
        accept: "application/vnd.github.v3+json",
        Authorization: `token ${accessToken}`,
      },
      data: {
        name: params.name,
        description: params.description,
        homepage: params.homepage,
        private: params.private,
      },
    });
    return {
      success: result.success,
      data: result.data,
      status: result.status,
    };
  }
}
