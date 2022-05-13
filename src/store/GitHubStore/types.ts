/** Интерфейс класса для работы с GitHub API
 * названия getOrganizationReposList
 * (а также типов GetOrganizationReposListParams и RepoItem)
 * поменяйте в соответствии с выполняемым запросом.
 * Или не меняйте, если делаете запрос за списком репоизториев для организации)
 * Выберите любой запрос из публичного API GitHub.
 */

import { StatusHTTP } from "@shared/store/ApiStore/types";

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
  data: {
    organization: {
      repositories: {
        nodes: {
          commitComments: {
            nodes: {
              commit: {
                message: string;
              };
            }[];
          };
          databaseId: number;
          name: string;
          owner: {
            avatarUrl: string;
            login: string;
          };
          updatedAt: string;
          stargazerCount: number;
        }[];
        pageInfo: {
          endCursor: string;
          hasNextPage: boolean;
        };
      };
    };
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
    endCursor: string | undefined
  ): Promise<ApiResp<RepoItem> | undefined>;
  createRepos(params: CreateReposParams): Promise<ApiResp<{}>>;
  getBranchList(params: GetBranchListParams): Promise<ApiResp<BranchesItem[]>>;
}
