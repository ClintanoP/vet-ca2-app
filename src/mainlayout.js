import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Flex, Button, Text } from '@chakra-ui/react';

const MainLayout = ({ signOut }) => (
  <div>
    {/* Navigation Bar */}
    <Flex as="nav" align="center" justify="space-between" padding="1.5rem" backgroundColor="blue.500" color="white">
      {/* Make Vet App text a clickable link */}
      <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>
        <Text fontSize="xl" cursor="pointer">Vet App</Text>
      </Link>
      <Flex gap="4">
        <Link to="/management" style={{ color: 'white', textDecoration: 'none' }}>Management</Link>
        {/* Add more links for other authenticated routes */}
        <Button onClick={signOut} colorScheme="red">Sign Out</Button>
      </Flex>
    </Flex>

    {/* Outlet for Nested Routes */}
    <Outlet />
  </div>
);

export default MainLayout;
