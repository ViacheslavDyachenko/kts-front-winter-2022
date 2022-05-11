import React from "react";

import Loader from "@components/Loader";
import {
  closeDrawer,
  getBranchesList,
} from "@store/getBranchesListStore/GetBranchesListStore";
import { Drawer } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

type RepoBranchesDrawerProps = {
  onClose: () => void;
  visible: true | false;
};

const RepoBranchesDrawer: React.FC<RepoBranchesDrawerProps> = ({
  onClose,
  visible,
}: RepoBranchesDrawerProps) => {
  const dispatch = useDispatch();

  const isLoading = useSelector((state: any) => state.branches.isLoading);
  const branches = useSelector((state: any) => state.branches.branches);
  const isError = useSelector((state: any) => state.branches.isError);

  const { company, title } = useParams();

  React.useEffect(() => {
    if (title && company) visible = true;
  }, [title, company]);

  React.useEffect(() => {
    dispatch(getBranchesList({ isLoading, company, title }));
  }, [isLoading, company, title]);

  React.useEffect(() => {
    if (!visible) {
      dispatch(closeDrawer());
    }
  }, [visible]);

  return (
    <Drawer
      title={`список веток репозитория: ${title}`}
      placement="right"
      onClose={onClose}
      visible={visible}
    >
      {isLoading ? (
        !isError ? (
          branches &&
          branches.map((item: any) => <p key={item.id}>{item.name}</p>)
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
