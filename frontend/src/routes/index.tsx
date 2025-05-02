import { Route, Routes } from "react-router-dom";
import TaxFormBase from "../components/forms/tax-form/TaxFormBase";
import TaxFormDetails from "../components/forms/tax-form/TaxFormDetails";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="id/:id" element={<TaxFormBase />} />
      <Route path="view/:id" element={<TaxFormDetails />} />
    </Routes>
  );
};

export default AppRoutes;