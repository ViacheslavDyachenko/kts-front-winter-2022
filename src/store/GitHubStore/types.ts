/** Интерфейс класса для работы с GitHub API
 * названия getOrganizationReposList
 * (а также типов GetOrganizationReposListParams и RepoItem)
 * поменяйте в соответствии с выполняемым запросом.
 * Или не меняйте, если делаете запрос за списком репоизториев для организации)
 * Выберите любой запрос из публичного API GitHub.
 */

import { StatusHTTP } from "@store/RootStore//ApiStore/types";

export type GetOrganizationReposListParams = {
  organizationName: string;
};

export type CreateReposParams = {
  organizationName: string;
  name: string;
  description?: string;
  homepage?: string;
  private?: boolean;
};

export type ApiResp<T> = {
  success: boolean;
  data: T;
  status: StatusHTTP;
};

export type RepoItem = {
  src: string;
  owner: string;
  repo: string;
  item: {
    id: string;
    title: string;
    company: string;
    counterStar: number;
    lastUpdate: string;
  };
};

export type GetBranchListParams = {
  ownerName: string;
  reposName: string;
};

export type BranchesItem = {
  id: string;
  name: string;
};

export interface IGitHubStore {
  getOrganizationReposList(
    params: GetOrganizationReposListParams,
    page: number
  ): Promise<ApiResp<RepoItem[]>>;
  createRepos(params: CreateReposParams): Promise<ApiResp<{}>>;
  getBranchList(params: GetBranchListParams): Promise<ApiResp<BranchesItem[]>>;
}
