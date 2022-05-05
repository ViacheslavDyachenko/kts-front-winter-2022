import React from "react";

import Button from "@components/Button";
import Input from "@components/Input";
import Loader from "@components/Loader";
import RepoBranchesDrawer from "@components/RepoBranchesDrawer";
import RepoTile from "@components/RepoTile";
import SearchIcon from "@components/SearchIcon";
import {
  getNextReposList,
  getParamsReduxHandler,
  getReposList,
  onChangeReduxHandler,
  onClickReduxHandler,
  onCloseReduxHandler,
  showDrawerReduxHandler,
} from "@store/getReposListStore/GetReposListStore";
import { ApiResp, RepoItem } from "@store/GitHubStore/types";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import GitHubStore from "store/GitHubStore";
import useReposListContext from "utils/useReposListContext";

import style from "./ReposSearchPage.module.scss";

const ReposSearchPage: React.FC = () => {
  const searchIcon = React.useMemo(() => {
    const componentSearchIcon = <SearchIcon />;
    return componentSearchIcon;
  }, []);

  const dispatch = useDispatch();

  const { company, title } = useParams();

  const onChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    let element = event.target;

    dispatch(onChangeReduxHandler({ value: element.value }));
  };

  const onChangeHandler = React.useCallback(onChange, []);

  const onClick = (): void => {
    dispatch(onClickReduxHandler({ load: true, page: 1, hasMore: true }));
  };

  const onClickHandler = React.useCallback(onClick, []);

  const showDrawer = (event: React.MouseEvent<HTMLDivElement>) => {
    let elem = event.currentTarget;
    dispatch(showDrawerReduxHandler({ elem: elem }));
  };

  const onClose = () => {
    dispatch(onCloseReduxHandler());
  };

  const [value, setValue] = React.useState(useSelector((state: any) => state.value));
  const [page, setpage] = React.useState(useSelector((state: any) => state.page));
  const [load, setload] = React.useState(useSelector((state: any) => state.load));

  React.useEffect(() => {
    dispatch(getReposList({ value: value, page: page, load }));
  }, []);

  React.useEffect(() => {
    dispatch(getParamsReduxHandler({ title: title, company: company }));
  }, []);

  const fetchData = async () => {
    const value = useSelector((state: any) => state.value);
    const page = useSelector((state: any) => state.page);
    dispatch(getNextReposList({ value: value, page: page }));
  };

  return (
    <>
      <div className={style.search}>
        <Input
          value={useSelector((state: any) => state.value)}
          placeholder="Введите название организации"
          onChange={onChangeHandler}
        />
        <Button
          onClick={onClickHandler}
          disabled={useSelector((state: any) => state.disabled)}
        >
          {searchIcon}
        </Button>
      </div>
      {useSelector((state: any) => state.result)?.status === 404 && (
        <h4 className={style.error}>Вы ввели не существующую организацию</h4>
      )}
      {useSelector((state: any) => state.result)?.status === 403 && (
        <h4 className={style.error}>
          Превышен лимит запросов, повторите попытку через время
        </h4>
      )}
      {useSelector((state: any) => state.result)?.status === "BAD_STATUS" && (
        <h4 className={style.error}>
          Что-то пошло не так, перезагрузите страницу
        </h4>
      )}
      {useSelector((state: any) => state.result)?.success && (
        <InfiniteScroll
          className={style.repositories}
          next={fetchData}
          hasMore={useSelector((state: any) => state.hasMore)}
          dataLength={
            useSelector((state: any) => state.result)
              ? useSelector((state: any) => state.result).data.length
              : 0
          }
          scrollThreshold={1}
          loader={<Loader />}
        >
          {useSelector((state: any) => state.result)?.success &&
            useSelector((state: any) => state.result)?.data.map((repo: any) => (
              <RepoTile
                src={repo.src}
                key={repo.item.id}
                item={repo.item}
                onClick={showDrawer}
              />
            ))}
        </InfiniteScroll>
      )}
      {useSelector((state: any) => state.repo) && (
        <Link to="/repos">
          <RepoBranchesDrawer
            onClose={onClose}
            visible={useSelector((state: any) => state.visible)}
          />
        </Link>
      )}
    </>
  );
};
export default ReposSearchPage;
