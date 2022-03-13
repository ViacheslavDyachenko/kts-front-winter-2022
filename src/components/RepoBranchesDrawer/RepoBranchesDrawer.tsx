import React from "react";

import Loader from "@components/Loader";
import RepoBranchesStore from "@store/RepoBranchesStore";
import { Drawer } from "antd";
import { observer } from "mobx-react-lite";
import { useParams } from "react-router-dom";
import useLocalStore from "utils/useLocalStore";

type RepoBranchesDrawerProps = {
  onClose: () => void;
  visible: true | false;
};

const RepoBranchesDrawer: React.FC<RepoBranchesDrawerProps> = ({
  onClose,
  visible,
}: RepoBranchesDrawerProps) => {
  const getData = useLocalStore(() => new RepoBranchesStore());
  const { company, title } = useParams();
  title && company ? (getData.visible = true) : (getData.visible = false);

  React.useEffect(() => {
    if (visible) {
      getData.repoBranches(title, company);
    }
    if (!visible) {
      getData.isLoading = false;
      getData.isError = false;
    }
  });

  const onCloseHandler = () => {
    onClose();
    visible = false;
  };

  return (
    <Drawer
      title={`список веток репозитория: ${title}`}
      placement="right"
      onClose={onCloseHandler}
      visible={getData.visible}
    >
      {getData.isLoading ? (
        !getData.isError ? (
          getData.branches &&
          getData.branches.map((item) => <p key={item.id}>{item.name}</p>)
        ) : (
          <p>что-то пошло не так</p>
        )
      ) : (
        <Loader />
      )}
    </Drawer>
  );
};

export default observer(RepoBranchesDrawer);
