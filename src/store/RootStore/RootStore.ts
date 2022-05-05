import { configureStore } from "@reduxjs/toolkit";
import getReposListReducer from "@store/getReposListStore";

const store = configureStore({
  reducer: {
    counter: getReposListReducer,
  },
});

export default store;
