// Management.js
import React from 'react';
import { Box, Flex, Button, Text, Link } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

function Management({ signOut }) {
  return (
    <Box>
      {/* Navbar */}
      <Flex as="nav" align="center" justify="space-between" padding="1.5rem" backgroundColor="blue.500" color="white">
        <Text fontSize="xl">Management</Text>
        <Flex gap="4">
          <Link as={RouterLink} to="/booking" _hover={{ textDecoration: 'underline' }} color="white">Booking</Link>
          <Link as={RouterLink} to="/management" _hover={{ textDecoration: 'underline' }} color="white">Management</Link>
          {/* You can add more links here if needed */}
          <Button onClick={signOut} colorScheme="red">Sign Out</Button>
        </Flex>
      </Flex>

      {/* Management Page Content */}
      <Box padding="4">
        <Text fontSize="2xl">Management Dashboard</Text>
        {/* Add more management-specific content here */}
        <Text mt="4">Here you can manage your application's data, users, and more.</Text>
      </Box>
    </Box>
  );
}

export default Management;
