export type BranchesItemApi = {
  id: string;
  name: string;
};

export type BranchesItemModel = {
  id: string;
  name: string;
};

export const normalizeBranchesItem = (
  from: BranchesItemApi
): BranchesItemModel => {
  return {
    id: from.id,
    name: from.name,
  };
};
