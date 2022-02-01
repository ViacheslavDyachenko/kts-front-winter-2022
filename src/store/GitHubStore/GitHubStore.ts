import ApiStore from '../../shared/store/ApiStore';
import { HTTPMethod } from '../../shared/store/ApiStore/types';
import {ApiResp, GetOrganizationReposListParams, IGitHubStore, RepoItem} from "./types";

export default class GitHubStore implements IGitHubStore {
    private readonly _apiStore = new ApiStore('https://api.github.com'); // TODO: не забудьте передать baseUrl в конструктор

    // TODO: реализовать интерфейс IGitHubStore

    async getOrganizationReposList(params: GetOrganizationReposListParams): Promise<ApiResp<RepoItem[]>> {
        const response = await this._apiStore.request({method: HTTPMethod.GET, endpoint: params.organizationName,});
        return {success: response.success, data: response.data, status: response.status}
    }
}