import { ApiResp } from "@store/GitHubStore/types";
import { RepoItemModel } from "@store/Models/gitHub/RepoItem";
import { action, computed, flow, makeObservable, observable } from "mobx";
import GitHubStore from "store/GitHubStore";
import { ILocalStore } from "utils/useLocalStore/useLocalStore";

type PrivateFileds =
  | "_value"
  | "_load"
  | "_result"
  | "_repo"
  | "_visible"
  | "_page"
  | "_hasMore";

export default class ReposListStore implements ILocalStore {
  private readonly _gitHubStore = new GitHubStore();

  private _value: string = "";

  private _load: boolean = false;

  private _result: ApiResp<RepoItemModel[]> | null = null;

  private _repo: string = "";

  private _visible: boolean = false;

  private _page: number = 1;

  private _hasMore: boolean = true;

  get value() {
    return this._value;
  }

  get load() {
    return this._load;
  }

  get result() {
    return this._result;
  }

  get repo() {
    return this._repo;
  }

  set repo(val) {
    this._repo = val;
  }

  get visible() {
    return this._visible;
  }

  get page() {
    return this._page;
  }

  get hasMore() {
    return this._hasMore;
  }

  set hasMore(val) {
    this._hasMore = val;
  }

  constructor() {
    makeObservable<ReposListStore, PrivateFileds>(this, {
      _value: observable,
      _load: observable,
      _result: observable,
      _repo: observable,
      _visible: observable,
      _page: observable,
      _hasMore: observable,
      onChange: action,
      onClick: action,
      onClose: action,
      showDrawer: action,
      getReposFirstPage: action,
      destroy: action,
      value: computed,
      load: computed,
      result: computed,
      repo: computed,
      visible: computed,
      page: computed,
      hasMore: computed,
    });
  }

  onChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    let element = event.target;

    this._value = element.value;
  };

  onClick = (): void => {
    this._load = true;
    this._page = 1;
    this._hasMore = true;
    this._result = null;
    this.getReposFirstPage();
  };

  onClose = () => {
    this._visible = false;
  };

  showDrawer = (event: React.MouseEvent<HTMLDivElement>) => {
    let elem = event.currentTarget;
    if (!this._result) return;
    for (let item of this._result?.data) {
      if (parseInt(elem.id) === parseInt(item.item.id)) {
        this._repo = item.item.title;
      }
    }
    this._visible = true;
  };

  getReposFirstPage = flow(function* (this: ReposListStore) {
    const response = yield this._gitHubStore.getOrganizationReposList(
      { organizationName: this._value },
      this._page
    );
    this._result = {
      status: response.status,
      data: this._result
        ? this._result.data.concat(response.data)
        : response.data,
      success: response.success,
    };
    this._load = false;
    this._page++;
  });

  destroy() {
    this._value = "";
    this._load = false;
    this._result = null;
    this._repo = "";
    this._visible = false;
    this._page = 1;
    this._hasMore = true;
  }
}
