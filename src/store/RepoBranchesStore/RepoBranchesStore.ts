import GitHubStore from "@store/GitHubStore";
import { BranchesItemModel } from "@store/Models/gitHub/BranchesItem";
import { action, computed, flow, makeObservable, observable } from "mobx";
import { ILocalStore } from "utils/useLocalStore/useLocalStore";

type PrivateFileds =
  | "_branches"
  | "_isLoading"
  | "_isError"
  | "_company"
  | "_title";

export default class RepoBranchesStore implements ILocalStore {
  private readonly _gitHubStore = new GitHubStore();

  private _branches: BranchesItemModel[] | null = null;

  private _isLoading: boolean = false;

  private _isError: boolean = false;

  private _company: string = "";

  private _title: string = "";

  constructor() {
    makeObservable<RepoBranchesStore, PrivateFileds>(this, {
      _isLoading: observable,
      _branches: observable,
      _isError: observable,
      _company: observable,
      _title: observable,
      repoBranches: action,
      destroy: action,
      isLoading: computed,
      branches: computed,
      isError: computed,
      title: computed,
      company: computed,
    });
  }

  get branches() {
    return this._branches;
  }
  get isLoading() {
    return this._isLoading;
  }

  set isLoading(prop) {
    this._isLoading = prop;
  }

  get company() {
    return this._company;
  }

  set company(prop) {
    this._company = prop;
  }

  get title() {
    return this._title;
  }

  set title(prop) {
    this._title = prop;
  }

  get isError() {
    return this._isError;
  }

  set isError(prop) {
    this._isError = prop;
  }

  repoBranches = flow(function* (this: RepoBranchesStore) {
    if (!this._isLoading && this._company && this._title) {
      const result = yield this._gitHubStore.getBranchList({
        ownerName: this._company,
        reposName: this._title,
      });
      result.success ? (this._branches = result.data) : (this._isError = true);
      this._isLoading = true;
    }
  });
  destroy(): void {
    this._branches = null;
    this._isLoading = false;
  }
}
