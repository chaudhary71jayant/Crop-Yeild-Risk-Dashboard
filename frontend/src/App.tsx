import { Route, Routes } from "react-router-dom";
import DistrictListPage from "./pages/DistrictListPage";
import DistrictDetailPage from "./pages/DistrictDetailPage";
import DistrictComparePage from "./pages/DistrictComparePage";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<DistrictListPage />} />
      <Route path="/district/:id" element={<DistrictDetailPage />} />
      <Route path="/compare" element={<DistrictComparePage />} />
    </Routes>
  );
};

export default App;
