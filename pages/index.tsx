import { Provider } from "react-redux";
import store from "store/RootStore";
import ReposSearchPage from "views/ReposSearchPage";

export default function Home() {
  return (
    <Provider store={store}>
      <ReposSearchPage />
    </Provider>
  );
}
