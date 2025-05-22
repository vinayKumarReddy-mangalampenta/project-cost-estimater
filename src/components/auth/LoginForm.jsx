import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import {
	Box,
	Button,
	FormControl,
	FormLabel,
	Input,
	Stack,
	Text,
	Link,
	Divider,
	useToast,
	FormErrorMessage,
} from "@chakra-ui/react";
import { FcGoogle } from "react-icons/fc";
import {
	signInWithEmailAndPassword,
	signInWithPopup,
	GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../../firebase/config";
import {
	loginPending,
	login,
	loginFailed,
} from "../../features/auth/authSlice";

const LoginForm = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [formErrors, setFormErrors] = useState({});

	const dispatch = useDispatch();
	const { isLoading, error } = useSelector((state) => state.auth);
	const toast = useToast();

	const validate = () => {
		const errors = {};
		if (!email) errors.email = "Email is required";
		if (!password) errors.password = "Password is required";
		setFormErrors(errors);
		return Object.keys(errors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!validate()) return;

		try {
			dispatch(loginPending());
			await signInWithEmailAndPassword(auth, email, password);
			// Auth state change listener in App.jsx will handle dispatching login action
		} catch (err) {
			dispatch(loginFailed(err.message));
			toast({
				title: "Login Failed",
				description: err.message,
				status: "error",
				duration: 5000,
				isClosable: true,
			});
		}
	};

	const handleGoogleLogin = async () => {
		try {
			dispatch(loginPending());
			const provider = new GoogleAuthProvider();
			await signInWithPopup(auth, provider);
			// Auth state change listener in App.jsx will handle dispatching login action
		} catch (err) {
			dispatch(loginFailed(err.message));
			toast({
				title: "Google Login Failed",
				description: err.message,
				status: "error",
				duration: 5000,
				isClosable: true,
			});
		}
	};

	// New handler for dummy login button — fills form with dummy credentials
	const handleDummyLogin = () => {
		setEmail(import.meta.env.VITE_DUMMY_EMAIL || "");
		setPassword(import.meta.env.VITE_DUMMY_PASSWORD || "");
	};

	return (
		<Box as="form" onSubmit={handleSubmit}>
			<Stack spacing={4}>
				<FormControl id="email" isInvalid={!!formErrors.email}>
					<FormLabel>Email address</FormLabel>
					<Input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
					<FormErrorMessage>{formErrors.email}</FormErrorMessage>
				</FormControl>

				<FormControl id="password" isInvalid={!!formErrors.password}>
					<FormLabel>Password</FormLabel>
					<Input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<FormErrorMessage>{formErrors.password}</FormErrorMessage>
				</FormControl>

				<Button
					type="submit"
					colorScheme="primary"
					isLoading={isLoading}
					loadingText="Logging in"
				>
					Sign in
				</Button>

				{/* Dummy Login button */}
				<Button
					type="button"
					colorScheme="orange"
					onClick={handleDummyLogin}
					isDisabled={isLoading}
				>
					Use Dummy Login
				</Button>

				<Divider />

				<Button
					w="full"
					variant="outline"
					leftIcon={<FcGoogle />}
					onClick={handleGoogleLogin}
					isLoading={isLoading}
				>
					Sign in with Google
				</Button>

				<Text align="center">
					Don't have an account?{" "}
					<Link as={RouterLink} to="/register" color="primary.500">
						Sign up
					</Link>
				</Text>
			</Stack>
		</Box>
	);
};

export default LoginForm;
