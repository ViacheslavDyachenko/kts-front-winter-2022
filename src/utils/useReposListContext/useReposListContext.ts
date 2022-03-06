import { createContext, useContext } from "react";

const RepoContext = createContext({
  branchData: { owner: "", repo: "" },
  disabled: false,
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => {},
});

const useReposListContext = () => {
  const Provider = RepoContext.Provider;

  const useReposContext = () => useContext(RepoContext);

  const context = useReposContext();

  return { Provider, context };
};

export default useReposListContext;
