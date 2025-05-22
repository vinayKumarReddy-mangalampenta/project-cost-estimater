import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
  Link,
  useToast,
  FormErrorMessage
} from '@chakra-ui/react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { loginPending, loginFailed } from '../../features/auth/authSlice';

const RegisterForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formErrors, setFormErrors] = useState({});
  
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector(state => state.auth);
  const toast = useToast();

  const validate = () => {
    const errors = {};
    if (!name) errors.name = 'Name is required';
    if (!email) errors.email = 'Email is required';
    if (!password) errors.password = 'Password is required';
    if (password.length < 6) errors.password = 'Password must be at least 6 characters';
    if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    try {
      dispatch(loginPending());
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with name
      await updateProfile(userCredential.user, {
        displayName: name
      });
      
      toast({
        title: 'Account created successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      // Auth state change listener in App.jsx will handle dispatching login action
    } catch (err) {
      dispatch(loginFailed(err.message));
      toast({
        title: 'Registration Failed',
        description: err.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <Stack spacing={4}>
        <FormControl id="name" isInvalid={!!formErrors.name}>
          <FormLabel>Name</FormLabel>
          <Input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <FormErrorMessage>{formErrors.name}</FormErrorMessage>
        </FormControl>
        
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
        
        <FormControl id="confirm-password" isInvalid={!!formErrors.confirmPassword}>
          <FormLabel>Confirm Password</FormLabel>
          <Input 
            type="password" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <FormErrorMessage>{formErrors.confirmPassword}</FormErrorMessage>
        </FormControl>
        
        <Button
          type="submit"
          colorScheme="primary"
          isLoading={isLoading}
          loadingText="Creating account"
        >
          Sign up
        </Button>
        
        <Text align="center">
          Already have an account?{' '}
          <Link as={RouterLink} to="/login" color="primary.500">
            Sign in
          </Link>
        </Text>
      </Stack>
    </Box>
  );
};

export default RegisterForm;