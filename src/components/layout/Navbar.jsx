import { useSelector, useDispatch } from 'react-redux';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  Text,
  Button,
  Stack,
  useColorModeValue,
  useBreakpointValue,
  Container,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  IconButton,
  useToast
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { logout } from '../../features/auth/authSlice';

const Navbar = () => {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  
  const isDesktop = useBreakpointValue({ base: false, md: true });
  
  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(logout());
      navigate('/login');
      toast({
        title: 'Logged out successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error signing out',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      bg={useColorModeValue('white', 'gray.800')}
      boxShadow="sm"
      position="sticky"
      top={0}
      zIndex={10}
    >
      <Container maxW="container.xl">
        <Flex
          h={16}
          alignItems="center"
          justifyContent="space-between"
        >
          <Text
            fontSize="xl"
            fontWeight="bold"
            color="primary.500"
            as={RouterLink}
            to="/"
            _hover={{ textDecoration: 'none' }}
          >
            Project Cost Tracker
          </Text>

          <Flex alignItems="center">
            {user ? (
              <Stack direction="row" spacing={4} align="center">
                {isDesktop ? (
                  <>
                    <Text fontWeight="medium">Hi, {user.displayName || user.email}</Text>
                    <Button
                      variant="ghost"
                      colorScheme="primary"
                      onClick={handleLogout}
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      icon={<Avatar size="sm" name={user.displayName || user.email} />}
                      variant="ghost"
                    />
                    <MenuList>
                      <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </MenuList>
                  </Menu>
                )}
              </Stack>
            ) : (
              <Stack direction="row" spacing={4}>
                <Button
                  as={RouterLink}
                  to="/login"
                  variant="ghost"
                  colorScheme="primary"
                >
                  Sign In
                </Button>
                <Button
                  as={RouterLink}
                  to="/register"
                  colorScheme="primary"
                >
                  Sign Up
                </Button>
              </Stack>
            )}
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
};

export default Navbar;