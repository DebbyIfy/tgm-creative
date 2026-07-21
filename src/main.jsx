import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import TgmAcademyWebsite from "./TgmAcademyWebsite.jsx";
import RegistrationForm from "./RegistrationForm.jsx";
import DonationForm from "./DonationForm.jsx";
import NotFound from "./NotFound.jsx";

const route = window.location.pathname.replace(/\/+$/, "");

function Router() {
  if (route === "/donate") {
    window.location.replace("/sponsor");
    return null;
  }
  if (route === "") return <TgmAcademyWebsite />;
  if (route === "/register") return <RegistrationForm />;
  if (route === "/sponsor") return <DonationForm />;
  return <NotFound />;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router />
  </StrictMode>
);
