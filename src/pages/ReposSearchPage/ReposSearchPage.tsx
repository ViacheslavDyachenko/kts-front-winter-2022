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
  const [isLoading, setIsLoading] = React.useState(false);
  const [result, setResult] = React.useState<ApiResp<RepoItem[]> | null>(null);
  const [disabled, setDisabled] = React.useState(false);
  const [owner, setOwner] = React.useState("");
  const [repo, setRepo] = React.useState("");
  const [visible, setVisible] = React.useState(false);

  const onChange = (event: React.FormEvent): void => {
    let element = event.target as HTMLInputElement;

    setValue(element.value);
  };

  const onChangeHandler = React.useCallback((event) => {
    onChange(event);
  }, []);

  const onClick = (): void => {
    setLoad(true);
  };

  const onClickHandler = React.useCallback(() => {
    onClick();
  }, []);

  const showDrawer = (event: React.MouseEvent) => {
    let elem = event.currentTarget as HTMLDivElement;
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
    const gitHubStore = new GitHubStore();
    if (!load) return;
    setDisabled(true);
    gitHubStore
      .getOrganizationReposList({ organizationName: value })
      .then((result) => {
        setResult(result);
        setIsLoading(result.success);
        setDisabled(false);
        setLoad(false);
      });
  }, [load, value]);

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
        {isLoading &&
          result?.data.map((repo) => (
            <RepoTile
              letter={repo.item.title.slice(0, 1)}
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
