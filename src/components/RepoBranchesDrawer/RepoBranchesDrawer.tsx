import React from "react";

import { Drawer } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

type RepoBranchesDrawerProps = {
  onClose: () => void;
  visible: true | false;
  branchesList: string[][];
};

const RepoBranchesDrawer: React.FC<RepoBranchesDrawerProps> = ({
  onClose,
  visible,
  branchesList,
}: RepoBranchesDrawerProps) => {
  const dispatch = useDispatch();

  const { company, title } = useParams();

  const result = useSelector((state: any) => state.repos.result);

  const [branches, setBranches] = React.useState(
    result.data.data.organization.repositories.nodes
      .find((item: any) => item.name === title)
      .commitComments.nodes.map((item: any) => item.commit.message)
  );

  React.useEffect(() => {
    if (title && company) visible = true;
    //eslint-disable-next-line
    console.log(visible);
  }, [title, company]);

  return (
    <Drawer
      title={`список веток репозитория: ${title}`}
      placement="right"
      onClose={onClose}
      visible={visible}
    >
      {branches &&
        branches.map((item: any, index: number) => <p key={index}>{item}</p>)}
    </Drawer>
  );
};

export default React.memo(RepoBranchesDrawer);
