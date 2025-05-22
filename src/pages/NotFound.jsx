import { Box, Heading, Text, Button, Container, VStack } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const NotFound = () => {
  return (
    <Container maxW="container.md" py={16}>
      <VStack spacing={6} textAlign="center">
        <Heading size="2xl" color="primary.500">404</Heading>
        <Heading size="xl">Page Not Found</Heading>
        <Text fontSize="lg" color="gray.600">
          The page you are looking for doesn't exist or has been moved.
        </Text>
        <Button
          as={RouterLink}
          to="/"
          colorScheme="primary"
          size="lg"
          mt={4}
        >
          Go Home
        </Button>
      </VStack>
    </Container>
  );
};

export default NotFound;