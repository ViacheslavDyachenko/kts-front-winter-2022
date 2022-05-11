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
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";

import style from "./ReposSearchPage.module.scss";

const ReposSearchPage: React.FC = () => {
  const searchIcon = React.useMemo(() => {
    const componentSearchIcon = <SearchIcon />;
    return componentSearchIcon;
  }, []);

  const dispatch = useDispatch();

  const { company, title } = useParams();

  const stateValue = useSelector((state: any) => state.repos.value);
  const statePage = useSelector((state: any) => state.repos.page);
  const stateLoad = useSelector((state: any) => state.repos.load);
  const hasMore = useSelector((state: any) => state.repos.hasMore);
  const result = useSelector((state: any) => state.repos.result);
  const success = useSelector((state: any) => state.repos.result)?.success;
  const visible = useSelector((state: any) => state.repos.visible);
  const disabled = useSelector((state: any) => state.repos.disabled);
  const status = useSelector((state: any) => state.repos.result)?.status;

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
    dispatch(onClickReduxHandler({ load: true, page: 1, hasMore: true }));
    dispatch(getReposList({ value, page, load }));
  }, [value, load]);

  const showDrawer = (event: React.MouseEvent<HTMLDivElement>) => {
    let elem = event.currentTarget;
    dispatch(showDrawerReduxHandler({ id: elem.id }));
  };

  const onClose = () => {
    dispatch(onCloseReduxHandler());
  };

  React.useEffect(() => {
    dispatch(getParamsReduxHandler({ title: title, company: company }));
  }, []);

  React.useEffect(() => {
    setValue(stateValue);
    setpage(statePage);
    setload(stateLoad);
  });

  const fetchData = async () => {
    dispatch(getNextReposList({ value: value, page: page }));
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
      {status === 404 && (
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
      {success && (
        <InfiniteScroll
          className={style.repositories}
          next={fetchData}
          hasMore={hasMore}
          dataLength={result ? result : 0}
          scrollThreshold={1}
          loader={<Loader />}
        >
          {success &&
            result?.data.map((repo: any) => (
              <RepoTile
                src={repo.src}
                key={repo.item.id}
                item={repo.item}
                onClick={showDrawer}
              />
            ))}
        </InfiniteScroll>
      )}
      {visible && (
        <Link to="/repos">
          <RepoBranchesDrawer onClose={onClose} visible={visible} />
        </Link>
      )}
    </>
  );
};
export default ReposSearchPage;
