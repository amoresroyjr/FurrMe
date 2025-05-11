import PetPreview from "../pages/Public/PetPreview";
import AdoptPage from "../pages/User/AdoptPage";
import Profile from "../pages/User/ManageProfile";
import Community from "../pages/User/Community";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import AdoptionRequests from "../pages/Admin/AdoptionRequests";
import CreatePetListing from "../pages/Admin/CreatePetListing";
import PetEvaluation from "../pages/Admin/PetEvaluation";
import PetDetails from "../pages/Admin/PetDetails";

import Login from "../pages/Public/Login";
import Register from "../pages/Public/Register";
import AllPets from "../pages/Public/AllPets";
import Resources from "../pages/Public/Resources";
import FAQS from "../pages/Public/FAQs";
import Terms from "../pages/Public/TermsAndConditions";
import ForgotPassword from "../pages/Public/ForgotPassword";

export const PublicRoutes = [
	{ path: "/", element: <Login /> },
	{ path: "/login", element: <Login /> },
	{ path: "/register", element: <Register /> },
	{ path: "/pets", element: <AllPets /> },
	{ path: "/forgot", element: <ForgotPassword /> },
	{ path: "/resources", element: <Resources /> },
	{ path: "/terms", element: <Terms /> },
	{ path: "/FAQs", element: <FAQS /> },
];

export const RoutesData = [
	{ path: "/admin/pets", element: <AdminDashboard /> },
	{ path: "/admin/requests", element: <AdoptionRequests /> },
	{ path: "/admin/create", element: <CreatePetListing /> },
	{ path: "/admin/pets/:category/:id", element: <PetDetails /> },
	{ path: "/admin/pets/evaluate/:name", element: <PetEvaluation /> },

	{ path: "/profile", element: <Profile /> },
	{ path: "/pets/:id", element: <PetPreview /> },
	{ path: "/pets/:id/adopt", element: <AdoptPage /> },
	{ path: "/community", element: <Community /> },
	{ path: "/pets", element: <AllPets /> },
];
