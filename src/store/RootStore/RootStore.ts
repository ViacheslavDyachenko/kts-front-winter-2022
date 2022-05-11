import { configureStore } from "@reduxjs/toolkit";
import getBranchesListReducer from "@store/getBranchesListStore";
import getReposListReducer from "@store/getReposListStore";

const store = configureStore({
  reducer: {
    repos: getReposListReducer,
    branches: getBranchesListReducer,
  },
});

export default store;
