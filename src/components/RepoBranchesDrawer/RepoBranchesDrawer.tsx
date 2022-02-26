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
  const [load, setLoad] = React.useState(false);
  const [gitHubStore] = React.useState(() => new GitHubStore());
  const { company, title } = useParams();
  const { context } = useReposListContext();
  if (title && company) visible = true;

  React.useEffect(() => {
    if (!load) {
      gitHubStore
        .getBranchList({
          ownerName: company ? company : context.branchData.owner,
          reposName: title ? title : context.branchData.repo,
        })
        .then((result) => {
          result.success
            ? setBranches(result.data)
            : setBranches([{ name: "что-то пошло не так", id: "1" }]);
          setLoad(true);
        });
    }
  }, [load, context.branchData.owner, context.branchData.repo]);
  React.useEffect(() => {
    if (!visible) setLoad(false);
  });
  return (
    <Drawer
      title={`список веток репозитория: ${title}`}
      placement="right"
      onClose={onClose}
      visible={visible}
    >
      {load ? (
        branches && branches.map((item) => <p key={item.id}>{item.name}</p>)
      ) : (
        <Loader />
      )}
    </Drawer>
  );
};

export default React.memo(RepoBranchesDrawer);
