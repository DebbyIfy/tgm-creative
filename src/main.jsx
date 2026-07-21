import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import TgmAcademyWebsite from "./TgmAcademyWebsite.jsx";
import RegistrationForm from "./RegistrationForm.jsx";
import DonationForm from "./DonationForm.jsx";

const route = window.location.pathname.replace(/\/+$/, "");

function Router() {
  if (route === "/register") return <RegistrationForm />;
  if (route === "/sponsor") return <DonationForm />;
  return <TgmAcademyWebsite />;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router />
  </StrictMode>
);
