import React from "react";

import Button from "@components/Button";
import Input from "@components/Input";
import RepoBranchesDrawer from "@components/RepoBranchesDrawer";
import RepoTile from "@components/RepoTile";
import SearchIcon from "@components/SearchIcon";
import { ApiResp, RepoItem } from "@store/GitHubStore/types";
import GitHubStore from "store/GitHubStore";

import style from "./ReposSearchPage.module.css";

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
  const [gitHubStore] = React.useState(() => new GitHubStore());

  const onChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    let element = event.target;

    setValue(element.value);
  };

  const onChangeHandler = React.useCallback(onChange, []);

  const onClick = (): void => {
    setLoad(true);
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
      .getOrganizationReposList({ organizationName: value })
      .then((result) => {
        setResult(result);
        setDisabled(false);
        setLoad(false);
      });
  }, [gitHubStore, load, value]);

  return (
    <>
      <div className={style.search}>
        <Input
          value={value}
          placeholder="Введите название организации"
          onChange={onChangeHandler}
        />
        <Button disabled={disabled} onClick={onClickHandler}>
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
      <div className={style.repositories}>
        {!disabled &&
          result?.data.map((repo) => (
            <RepoTile
              src={repo.src}
              key={repo.item.id}
              item={repo.item}
              onClick={showDrawer}
            />
          ))}
      </div>
      {visible && (
        <RepoBranchesDrawer
          repo={repo}
          owner={owner}
          onClose={onClose}
          visible={visible}
        />
      )}
    </>
  );
};
export default ReposSearchPage;
