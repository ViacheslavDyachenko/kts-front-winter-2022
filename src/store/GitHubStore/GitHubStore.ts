import {
  BranchesItemApi,
  BranchesItemModel,
  normalizeBranchesItem,
} from "@store/Models/gitHub/BranchesItem";
import {
  normalizeRepoItem,
  RepoItemApi,
  RepoItemModel,
} from "@store/Models/gitHub/RepoItem";
import ApiStore from "@store/RootStore/ApiStore";
import { ApiResponse, HTTPMethod } from "@store/RootStore/ApiStore/types";

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
    page: number
  ): Promise<ApiResp<RepoItemModel[]>> {
    const response = await this._apiStore.request<
      ApiResponse<RepoItemApi, RepoItemApi>
    >({
      method: HTTPMethod.GET,
      endpoint: `/orgs/${params.organizationName}/repos?per_page=10&page=${page}`,
    });
    try {
      response.data = await response.data.map((item: any) => {
        return normalizeRepoItem({
          src: item.owner.avatar_url,
          owner: item.owner.login,
          repo: item.name,
          item: {
            id: item.id,
            title: item.name,
            company: item.owner.login,
            counter_star: item.watchers,
            last_update:
              "Updated " +
              new Date(item.updated_at).getDay() +
              " " +
              new Date(item.updated_at).toLocaleString("en", { month: "long" }),
          },
        });
      });
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

  async getBranchList(
    params: GetBranchListParams
  ): Promise<ApiResp<BranchesItemModel[]>> {
    let response = await this._apiStore.request<
      ApiResponse<BranchesItemApi, BranchesItemApi>
    >({
      method: HTTPMethod.GET,
      endpoint: `/repos/${params.ownerName}/${params.reposName}/branches`,
      headers: {},
    });
    try {
      response.data = await response.data.map((item: any) => {
        return normalizeBranchesItem({
          id: item.commit.sha,
          name: item.name,
        });
      });
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
