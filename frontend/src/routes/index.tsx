import TaxFormBase from "../components/forms/tax-form/TaxFormBase";
import TaxFormDetails from "../components/forms/tax-form/TaxFormDetails";

<Route path="tax-form/id/:id" element={<TaxFormBase />} />
<Route path="tax-form/view/:id" element={<TaxFormDetails />} /> 