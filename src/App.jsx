import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import RequireAuth from "./data/RequireAuth";
import { RoutesData, PublicRoutes } from "./data/RoutesData";
import Homepage from "../src/pages/Public/Homepage";

function App() {
	const user = useSelector((state) => state.value);

	return (
		<Router>
			<Routes>
				<Route
					path="/"
					element={user ? <Navigate to="/pets" /> : <Homepage />}
				/>

				{PublicRoutes.map((route, index) => {
					const isRestricted = ["/", "/login", "/register"].includes(
						route.path
					);

					const shouldRedirect =
						user &&
						(isRestricted ||
							(user.user.role === "Admin" && !route.path.startsWith("/admin")));

					return (
						<Route
							key={index}
							path={route.path}
							element={
								shouldRedirect ? (
									<Navigate
										to={user.user.role === "Admin" ? "/admin/pets" : "/pets"}
									/>
								) : (
									route.element
								)
							}
						/>
					);
				})}

				{RoutesData.map((route, index) => (
					<Route
						key={index}
						path={route.path}
						element={<RequireAuth>{route.element}</RequireAuth>}
					/>
				))}

				<Route
					path="*"
					element={
						<Navigate
							to={user?.user.role === "Admin" ? "/admin/pets" : "/pets"}
						/>
					}
				/>
			</Routes>
		</Router>
	);
}

export default App;
