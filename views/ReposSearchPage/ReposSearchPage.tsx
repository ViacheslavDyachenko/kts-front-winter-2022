import React from "react";

import Button from "components/Button";
import Input from "components/Input";
import Loader from "components/Loader";
import RepoBranchesDrawer from "components/RepoBranchesDrawer";
import RepoTile from "components/RepoTile";
import SearchIcon from "components/SearchIcon";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import {
  getNextReposList,
  getReposList,
  onChangeReduxHandler,
  onClickReduxHandler,
  onCloseReduxHandler,
  showDrawerReduxHandler,
} from "store/getReposListStore/GetReposListStore";

import style from "./ReposSearchPage.module.scss";

export default function Home() {
  const searchIcon = React.useMemo(() => {
    const componentSearchIcon = <SearchIcon />;
    return componentSearchIcon;
  }, []);

  const dispatch = useDispatch();

  const stateValue = useSelector((state: any) => state.repos.value);
  const statePage = useSelector((state: any) => state.repos.page);
  const stateLoad = useSelector((state: any) => state.repos.load);
  const hasMore = useSelector((state: any) => state.repos.hasMore);
  const endCursor = useSelector((state: any) => state.repos.endCursor);
  const result = useSelector((state: any) => state.repos.result);
  const success = useSelector((state: any) => state.repos.result)?.success;
  const visible = useSelector((state: any) => state.repos.visible);
  const disabled = useSelector((state: any) => state.repos.disabled);
  const status = useSelector((state: any) => state.repos.result)?.status;
  const owner = useSelector((state: any) => state.repos.owner);
  const repo = useSelector((state: any) => state.repos.repo);

  const [value, setValue] = React.useState(stateValue);
  const [page, setpage] = React.useState(statePage);
  const [load, setload] = React.useState(stateLoad);

  const onChangeHandler = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      let element = event.target;
      dispatch(onChangeReduxHandler({ value: element.value }));
    },
    []
  );

  const onClickHandler = React.useCallback((): void => {
    dispatch(onClickReduxHandler({ load: true, page: 20, hasMore: true }));
  }, [value, load]);

  const showDrawer = (event: React.MouseEvent<HTMLDivElement>) => {
    let elem = event.currentTarget;
    dispatch(showDrawerReduxHandler({ id: elem.id }));
  };

  const onClose = () => {
    dispatch(onCloseReduxHandler());
  };

  React.useEffect(() => {
    if (!load && page !== 20) return;
    dispatch<any>(getReposList({ value, load, endCursor }));
  }, [load]);

  //React.useEffect(() => {
  //dispatch<any>(getParamsReduxHandler({ title: title, company: company }));
  //}, []);

  React.useEffect(() => {
    setValue(stateValue);
    setpage(statePage);
    setload(stateLoad);
  });

  const fetchData = async () => {
    dispatch<any>(getNextReposList({ value: value, page: page, endCursor }));
  };

  return (
    <>
      <div className={style.search}>
        <Input
          value={value}
          placeholder="Введите название организации"
          onChange={onChangeHandler}
        />
        <Button onClick={onClickHandler} disabled={disabled}>
          {searchIcon}
        </Button>
      </div>
      {result?.data.data.organization === null && (
        <h4 className={style.error}>Вы ввели не существующую организацию</h4>
      )}
      {status === 403 && (
        <h4 className={style.error}>
          Превышен лимит запросов, повторите попытку через время
        </h4>
      )}
      {status === "BAD_STATUS" && (
        <h4 className={style.error}>
          Что-то пошло не так, перезагрузите страницу
        </h4>
      )}
      {success && result?.data.data.organization && (
        <InfiniteScroll
          className={style.repositories}
          next={fetchData}
          hasMore={hasMore}
          dataLength={result ? result : 0}
          scrollThreshold={1}
          loader={<Loader />}
        >
          {success &&
            result?.data.data.organization.repositories.nodes.map(
              (repo: any, index: number) => {
                return (
                  <RepoTile
                    src={repo.owner.avatarUrl}
                    key={repo.databaseId}
                    item={{
                      id: repo.databaseId,
                      title: repo.name,
                      company: repo.owner.login,
                      counterStar: repo.stargazerCount,
                      lastUpdate:
                        "Updated " +
                        new Date(repo.updatedAt).getDay() +
                        " " +
                        new Date(repo.updatedAt).toLocaleString("en", {
                          month: "long",
                        }),
                    }}
                    onClick={showDrawer}
                  />
                );
              }
            )}
        </InfiniteScroll>
      )}
      {visible && (
        <RepoBranchesDrawer
          onClose={onClose}
          visible={visible}
          company={owner}
          title={repo}
        />
      )}
    </>
  );
}
