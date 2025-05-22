import {
  Box,
  Container,
  Heading,
  Text,
  Stack,
  Card,
  CardBody
} from '@chakra-ui/react';
import LoginForm from '../components/auth/LoginForm';

const LoginPage = () => {
  return (
    <Container maxW="md" py={12}>
      <Card boxShadow="lg" borderRadius="xl">
        <CardBody p={8}>
          <Stack spacing={6}>
            <Box textAlign="center">
              <Heading size="xl" mb={2} color="primary.500">Welcome Back</Heading>
              <Text color="gray.600">Sign in to manage your project costs</Text>
            </Box>
            
            <LoginForm />
          </Stack>
        </CardBody>
      </Card>
    </Container>
  );
};

export default LoginPage;