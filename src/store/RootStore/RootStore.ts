import { configureStore } from "@reduxjs/toolkit";
import getReposListReducer from "@store/getReposListStore";

const store = configureStore({
  reducer: {
    repos: getReposListReducer,
  },
});

export default store;
