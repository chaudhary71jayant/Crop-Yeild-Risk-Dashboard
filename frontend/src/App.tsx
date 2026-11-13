import { Route, Routes } from "react-router-dom";
import DistrictListPage from "./pages/DistrictListPage";
import DistrictDetailPage from "./pages/DistrictDetailPage";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<DistrictListPage />} />
      <Route path="/district/:id" element={<DistrictDetailPage />} />
    </Routes>
  );
};

export default App;
