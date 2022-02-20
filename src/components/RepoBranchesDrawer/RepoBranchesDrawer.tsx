import React from "react";

import GitHubStore from "@store/GitHubStore";
import { BranchesItem } from "@store/GitHubStore/types";
import { Drawer } from "antd";

import style from "./RepoBranchesDrawer.module.css";
import "antd/dist/antd.css";

type repoBranchesDrawerProps = {
  onClose: () => void;
  visible: true | false;
  owner: string;
  repo: string;
};

const RepoBranchesDrawer = ({
  onClose,
  visible,
  repo,
  owner,
}: repoBranchesDrawerProps) => {
  const [branches, setBranches] = React.useState<BranchesItem[] | null>(null);
  const [load, setLoad] = React.useState(false);

  if (!visible && load) setLoad(false);

  React.useEffect(() => {
    const gitHubStore = new GitHubStore();
    if (!load) {
      gitHubStore
        .GetBranchList({ ownerName: owner, reposName: repo })
        .then((result) => {
          setBranches(result.data);
          setLoad(true);
        });
    }
  }, [load, owner, repo]);

  return (
    <>
      {visible && (
        <Drawer
          title={`список веток репозитория: ${repo}`}
          placement="right"
          onClose={onClose}
          visible={visible}
        >
          {branches &&
            branches.map((item) => (
              <p className={style.list_branch} key={item.id}>
                {item.name}
              </p>
            ))}
        </Drawer>
      )}
    </>
  );
};

export default RepoBranchesDrawer;
