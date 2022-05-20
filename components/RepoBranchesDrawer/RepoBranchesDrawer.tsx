import React from "react";

import { Drawer } from "antd";
import { useSelector } from "react-redux";

type RepoBranchesDrawerProps = {
  onClose: () => void;
  visible: true | false;
  company: string;
  title: string;
};

const RepoBranchesDrawer: React.FC<RepoBranchesDrawerProps> = ({
  onClose,
  visible,
  company,
  title,
}: RepoBranchesDrawerProps) => {
  const result = useSelector((state: any) => state.repos.result);

  const [branches] = React.useState(
    result.data.data.organization.repositories.nodes
      .find((item: any) => item.name === title)
      .commitComments.nodes.map((item: any) => item.commit.message)
  );

  React.useEffect(() => {
    if (title && company) visible = true;
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
