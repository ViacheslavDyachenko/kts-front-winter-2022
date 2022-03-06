import ApiStore from "./ApiStore";

export default class RootStore {
  readonly apiStore = new ApiStore("https://api.github.com");
}
