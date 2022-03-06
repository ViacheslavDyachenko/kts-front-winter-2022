import React from "react";

import Loader from "@components/Loader";
import GitHubStore from "@store/GitHubStore";
import { BranchesItem } from "@store/GitHubStore/types";
import { Drawer } from "antd";
import { useParams } from "react-router-dom";
import useReposListContext from "utils/useReposListContext";

type RepoBranchesDrawerProps = {
  onClose: () => void;
  visible: true | false;
};

const RepoBranchesDrawer: React.FC<RepoBranchesDrawerProps> = ({
  onClose,
  visible,
}: RepoBranchesDrawerProps) => {
  const [branches, setBranches] = React.useState<BranchesItem[] | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
  const [gitHubStore] = React.useState(() => new GitHubStore());
  const { company, title } = useParams();
  if (title && company) visible = true;

  React.useEffect(() => {
    if (!isLoading && company && title) {
      gitHubStore
        .getBranchList({
          ownerName: company,
          reposName: title,
        })
        .then((result) => {
          result.success ? setBranches(result.data) : setIsError(true);
          setIsLoading(true);
        });
    }
  }, [isLoading, company, title]);
  React.useEffect(() => {
    if (!visible) {
      setIsLoading(false);
      setIsError(false);
    }
  });
  return (
    <Drawer
      title={`список веток репозитория: ${title}`}
      placement="right"
      onClose={onClose}
      visible={visible}
    >
      {isLoading ? (
        !isError ? (
          branches && branches.map((item) => <p key={item.id}>{item.name}</p>)
        ) : (
          <p>что-то пошло не так</p>
        )
      ) : (
        <Loader />
      )}
    </Drawer>
  );
};

export default React.memo(RepoBranchesDrawer);
