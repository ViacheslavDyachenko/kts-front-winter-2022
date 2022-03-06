import React from "react";

import Button from "@components/Button";
import Input from "@components/Input";
import Loader from "@components/Loader";
import RepoBranchesDrawer from "@components/RepoBranchesDrawer";
import RepoTile from "@components/RepoTile";
import SearchIcon from "@components/SearchIcon";
import { ApiResp, RepoItem } from "@store/GitHubStore/types";
import InfiniteScroll from "react-infinite-scroll-component";
import { Link, useParams } from "react-router-dom";
import GitHubStore from "store/GitHubStore";
import useReposListContext from "utils/useReposListContext";

import style from "./ReposSearchPage.module.scss";

const ReposSearchPage: React.FC = () => {
  const searchIcon = React.useMemo(() => {
    const componentSearchIcon = <SearchIcon />;
    return componentSearchIcon;
  }, []);

  const [value, setValue] = React.useState("");
  const [load, setLoad] = React.useState(false);
  const [result, setResult] = React.useState<ApiResp<RepoItem[]> | null>(null);
  const [disabled, setDisabled] = React.useState(false);
  const [owner, setOwner] = React.useState("");
  const [repo, setRepo] = React.useState("");
  const [visible, setVisible] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);
  const [gitHubStore] = React.useState(() => new GitHubStore());

  const { company, title } = useParams();

  const onChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    let element = event.target;

    setValue(element.value);
  };

  const onChangeHandler = React.useCallback(onChange, []);

  const onClick = (): void => {
    setLoad(true);
    setPage(1);
    setHasMore(true);
  };

  const onClickHandler = React.useCallback(onClick, []);

  const showDrawer = (event: React.MouseEvent<HTMLDivElement>) => {
    let elem = event.currentTarget;
    if (!result) return;
    for (let item of result?.data) {
      if (parseInt(elem.id) === parseInt(item.item.id)) {
        setOwner(item.owner);
        setRepo(item.item.title);
      }
    }
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  React.useEffect(() => {
    if (!load) return;
    setDisabled(true);
    gitHubStore
      .getOrganizationReposList({ organizationName: value }, page)
      .then((result) => {
        setResult(result);
        setDisabled(false);
        setLoad(false);
        setPage(page + 1);
      });
  }, [gitHubStore, load, value]);

  React.useEffect(() => {
    setRepo(title !== undefined ? title : "");
    setOwner(company !== undefined ? company : "");
  }, []);

  const fetchData = async () => {
    setDisabled(true);
    gitHubStore
      .getOrganizationReposList({ organizationName: value }, page)
      .then((response) => {
        setResult({
          status: response.status,
          data: result ? result.data.concat(response.data) : response.data,
          success: response.success,
        });
        setDisabled(false);
        setLoad(false);
        setPage(page + 1);
        if ((result ? result.data.length : 0) / 10 < page - 1) {
          setHasMore(false);
        }
      });
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
      {result?.status === 404 && (
        <h4 className={style.error}>Вы ввели не существующую организацию</h4>
      )}
      {result?.status === 403 && (
        <h4 className={style.error}>
          Превышен лимит запросов, повторите попытку через время
        </h4>
      )}
      {result?.status === "BAD_STATUS" && (
        <h4 className={style.error}>
          Что-то пошло не так, перезагрузите страницу
        </h4>
      )}
      {result?.success && (
        <InfiniteScroll
          className={style.repositories}
          next={fetchData}
          hasMore={hasMore}
          dataLength={result ? result.data.length : 0}
          scrollThreshold={1}
          loader={<Loader />}
        >
          {result?.success &&
            result?.data.map((repo) => (
              <RepoTile
                src={repo.src}
                key={repo.item.id}
                item={repo.item}
                onClick={showDrawer}
              />
            ))}
        </InfiniteScroll>
      )}
      {repo && (
        <Link to="/repos">
          <RepoBranchesDrawer onClose={onClose} visible={visible} />
        </Link>
      )}
    </>
  );
};
export default ReposSearchPage;
