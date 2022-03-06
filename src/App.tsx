import ReposSearchPage from "@pages/ReposSearchPage";
import { Navigate, Route, Routes } from "react-router-dom";

import "antd/dist/antd.css";
import "@styles/style.scss";
import "@styles/resets.scss";

function App() {
  return (
    <Routes>
      <Route path="/" element={<ReposSearchPage />}>
        <Route path="/repos" element={<ReposSearchPage />} />
        <Route path="/repos/:company/:title" element={<ReposSearchPage />} />
        <Route path="*" element={<Navigate replace to="/repos" />} />
      </Route>
    </Routes>
  );
}

export default App;
