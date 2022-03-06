import React from "react";

import Button from "@components/Button";
import Input from "@components/Input";
import Loader from "@components/Loader";
import RepoBranchesDrawer from "@components/RepoBranchesDrawer";
import RepoTile from "@components/RepoTile";
import SearchIcon from "@components/SearchIcon";
import ReposListStore from "@store/ReposListStore";
import { observer } from "mobx-react-lite";
import InfiniteScroll from "react-infinite-scroll-component";
import { Link, useParams } from "react-router-dom";
import useLocalStore from "utils/useLocalStore";

import style from "./ReposSearchPage.module.scss";

const ReposSearchPage: React.FC = () => {
  const getData = useLocalStore(() => new ReposListStore());

  const searchIcon = React.useMemo(() => {
    const componentSearchIcon = <SearchIcon />;
    return componentSearchIcon;
  }, []);

  const { title } = useParams();

  const onChangeHandler = React.useCallback(getData.onChange, []);

  const onClickHandler = React.useCallback(getData.onClick, []);

  React.useEffect(() => {
    getData.repo = title !== undefined ? title : "";
  }, []);

  return (
    <>
      <div className={style.search}>
        <Input
          value={getData.value}
          placeholder="Введите название организации"
          onChange={onChangeHandler}
        />
        <Button onClick={onClickHandler} disabled={getData.disabled}>
          {searchIcon}
        </Button>
      </div>
      {getData.result?.status === 404 && (
        <h4 className={style.error}>Вы ввели не существующую организацию</h4>
      )}
      {getData.result?.status === 403 && (
        <h4 className={style.error}>
          Превышен лимит запросов, повторите попытку через время
        </h4>
      )}
      {getData.result?.status === "BAD_STATUS" && (
        <h4 className={style.error}>
          Что-то пошло не так, перезагрузите страницу
        </h4>
      )}
      {getData.result?.success && (
        <InfiniteScroll
          className={style.repositories}
          next={getData.getReposNextPage}
          hasMore={getData.hasMore}
          dataLength={getData.result ? getData.result.data.length : 0}
          scrollThreshold={1}
          loader={<Loader />}
        >
          {getData.result?.success &&
            getData.result?.data.map((repo) => (
              <RepoTile
                src={repo.src}
                key={repo.item.id}
                item={repo.item}
                onClick={getData.showDrawer}
              />
            ))}
        </InfiniteScroll>
      )}
      {getData.repo && (
        <Link to="/repos">
          <RepoBranchesDrawer
            onClose={getData.onClose}
            visible={getData.visible}
          />
        </Link>
      )}
    </>
  );
};
export default observer(ReposSearchPage);
