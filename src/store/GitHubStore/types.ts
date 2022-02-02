/** Интерфейс класса для работы с GitHub API
 * названия getOrganizationReposList
 * (а также типов GetOrganizationReposListParams и RepoItem)
 * поменяйте в соответствии с выполняемым запросом.
 * Или не меняйте, если делаете запрос за списком репоизториев для организации)
 * Выберите любой запрос из публичного API GitHub.
 */

import { StatusHTTP } from "../../shared/store/ApiStore/types";

export type GetOrganizationReposListParams = {
    organizationName: string,
}

export type CreateReposParams = {
    organizationName: string,
    name: string,
    description?: string,
    homepage?: string,
    private?: boolean,

}

export type ApiResp<T> = 
    {
        success: boolean;
        data: T;
        status: StatusHTTP;
    }

export type RepoItem = Record<string, string>;

export interface IGitHubStore {
    getOrganizationReposList(params: GetOrganizationReposListParams): Promise<ApiResp<RepoItem[]>>;
    createRepos(params: CreateReposParams): Promise<ApiResp<{}>>;
}