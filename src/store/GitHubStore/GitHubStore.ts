import ApiStore from '../../shared/store/ApiStore';
import { HTTPMethod } from '../../shared/store/ApiStore/types';
import {ApiResp, CreateReposParams, GetOrganizationReposListParams, IGitHubStore, RepoItem} from "./types";

export default class GitHubStore implements IGitHubStore {
    private readonly _apiStore = new ApiStore('https://api.github.com');
    private readonly _apiStoreAuth = new ApiStore('https://github.com'); // TODO: не забудьте передать baseUrl в конструктор

    // TODO: реализовать интерфейс IGitHubStore

    async getOrganizationReposList(params: GetOrganizationReposListParams): Promise<ApiResp<RepoItem[]>> {
        const response = await this._apiStore.request({method: HTTPMethod.GET, endpoint: `/orgs/${params.organizationName}/repos`,});
        return {success: response.success, data: response.data, status: response.status}
    }

    async createRepos(params: CreateReposParams): Promise<ApiResp<{}>> {
        const clientID = 'ebac1c599a2b6c661bbb';
        const clientSecret = '84959d8866d4a5dadd51a26e7d3c0bb840cecfe9';

        const codeParam = window.location.search.replace( '?code=', ''); 
        
        const tokenResponse = await this._apiStoreAuth.request({
            method: HTTPMethod.POST,
            endpoint: '/login/oauth/access_token?' +
                        `client_id=${clientID}&` +
                        `client_secret=${clientSecret}&` +
                        `code=${codeParam}`,
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            }});
        const accessToken = tokenResponse.data.access_token;
        
        const result = await this._apiStore.request({
            method: HTTPMethod.POST,
            endpoint: `/orgs/${params.organizationName}/repos`,
            headers: {
                'accept': 'application/vnd.github.v3+json',
                'Authorization': `token ${accessToken}`
            },
            data: {
                "name": params.name,
                "description": params.description,
                "homepage": params.homepage,
                "private": params.private

            }});
        return {success: result.success, data: result.data, status: result.status}
    }
}