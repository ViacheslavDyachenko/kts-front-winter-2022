import ReposSearchPage from "@pages/ReposSearchPage";
import { Navigate, Route, Routes } from "react-router-dom";

import "@styles/style.scss";
import "antd/dist/antd.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<ReposSearchPage />} />
      <Route path="/repos" element={<ReposSearchPage />} />
      <Route path="/repos/:company/:title" element={<ReposSearchPage />} />
      <Route path="*" element={<Navigate replace to="/repos" />} />
    </Routes>
  );
}

export default App;
