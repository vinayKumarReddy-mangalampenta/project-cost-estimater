import {
	Box,
	Container,
	Heading,
	Text,
	Stack,
	Card,
	CardBody,
} from "@chakra-ui/react";
import RegisterForm from "../components/auth/RegisterForm";

const RegisterPage = () => {
	console.log("RegisterPage");
	return (
		<Container maxW="md" py={12}>
			<Card boxShadow="lg" borderRadius="xl">
				<CardBody p={8}>
					<Stack spacing={6}>
						<Box textAlign="center">
							<Heading size="xl" mb={2} color="primary.500">
								Create Account
							</Heading>
							<Text color="gray.600">
								Sign up to start tracking your project costs
							</Text>
						</Box>

						<RegisterForm />
					</Stack>
				</CardBody>
			</Card>
		</Container>
	);
};

export default RegisterPage;
