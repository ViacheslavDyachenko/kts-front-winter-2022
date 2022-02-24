import React from "react";

import GitHubStore from "@store/GitHubStore";
import { BranchesItem } from "@store/GitHubStore/types";
import { Drawer } from "antd";

type RepoBranchesDrawerProps = {
  onClose: () => void;
  visible: true | false;
  owner: string;
  repo: string;
};

const RepoBranchesDrawer: React.FC<RepoBranchesDrawerProps> = ({
  onClose,
  visible,
  repo,
  owner,
}: RepoBranchesDrawerProps) => {
  const [branches, setBranches] = React.useState<BranchesItem[] | null>(null);
  const [load, setLoad] = React.useState(false);
  const [gitHubStore] = React.useState(() => new GitHubStore());

  if (!visible && load) setLoad(false);

  React.useEffect(() => {
    if (!load) {
      gitHubStore
        .getBranchList({ ownerName: owner, reposName: repo })
        .then((result) => {
          setBranches(result.data);
          setLoad(true);
        });
    }
  }, [load, owner, repo]);

  return (
    <Drawer
      title={`список веток репозитория: ${repo}`}
      placement="right"
      onClose={onClose}
      visible={visible}
    >
      {branches && branches.map((item) => <p key={item.id}>{item.name}</p>)}
    </Drawer>
  );
};

export default React.memo(RepoBranchesDrawer);
