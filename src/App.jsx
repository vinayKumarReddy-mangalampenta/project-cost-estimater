import { useEffect } from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import { ChakraProvider, Box } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/config";
import { login, logout } from "./features/auth/authSlice";

// Components
import Navbar from "./components/layout/Navbar";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Pages
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFound from "./pages/NotFound";

// Theme
import theme from "./theme";

function App() {
	const dispatch = useDispatch();
	const { user, isAuthReady } = useSelector((state) => state.auth);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user) {
				dispatch(
					login({
						uid: user.uid,
						email: user.email,
						displayName: user.displayName,
					})
				);
			} else {
				dispatch(logout());
			}
		});

		return () => unsubscribe();
	}, [dispatch]);
	console.log("Auth State → user:", user, "isAuthReady:", isAuthReady);

	return (
		<ChakraProvider theme={theme}>
			<Router>
				<Box minH="100vh" minW="100vw" bg="gray.50">
					<Navbar />
					{/* {!isAuthReady && ( */}
					<Routes>
						<Route
							path="/"
							element={
								user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
							}
						/>
						<Route
							path="/login"
							element={!user ? <LoginPage /> : <Navigate to="/dashboard" />}
						/>
						<Route
							path="/register"
							element={!user ? <RegisterPage /> : <Navigate to="/dashboard" />}
						/>
						<Route
							path="/dashboard"
							element={
								<ProtectedRoute>
									<Dashboard />
								</ProtectedRoute>
							}
						/>
						<Route path="*" element={<NotFound />} />
					</Routes>
					{/* )}   */}
				</Box>
			</Router>
		</ChakraProvider>
	);
}

export default App;
