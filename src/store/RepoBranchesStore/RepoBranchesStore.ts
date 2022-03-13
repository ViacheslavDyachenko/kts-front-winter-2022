import GitHubStore from "@store/GitHubStore";
import { BranchesItemModel } from "@store/Models/gitHub/BranchesItem";
import { action, computed, flow, makeObservable, observable } from "mobx";
import { ILocalStore } from "utils/useLocalStore/useLocalStore";

type PrivateFileds = "_branches" | "_isLoading" | "_isError" | "_visible";

export default class RepoBranchesStore implements ILocalStore {
  private readonly _gitHubStore = new GitHubStore();

  private _branches: BranchesItemModel[] | null = null;

  private _isLoading: boolean = false;

  private _isError: boolean = false;

  private _visible: boolean = false;

  constructor() {
    makeObservable<RepoBranchesStore, PrivateFileds>(this, {
      _isLoading: observable,
      _branches: observable.ref,
      _isError: observable,
      _visible: observable,
      repoBranches: action,
      destroy: action,
      isLoading: computed,
      branches: computed,
      isError: computed,
      visible: computed,
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

  get isError() {
    return this._isError;
  }

  set isError(prop) {
    this._isError = prop;
  }

  get visible() {
    return this._visible;
  }

  set visible(val) {
    this._visible = val;
  }

  repoBranches = flow(function* (
    this: RepoBranchesStore,
    title: string | undefined,
    company: string | undefined
  ) {
    if (!this._isLoading && company && title) {
      const result = yield this._gitHubStore.getBranchList({
        ownerName: company,
        reposName: title,
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
