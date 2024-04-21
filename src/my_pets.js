import React, { useState, useEffect } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';
import { Box, Text } from '@chakra-ui/react';

function MyPets({ user }) {
  // State to determine if the user has access
  const [hasAccess, setHasAccess] = useState(false);

  // Check user role for access rights
  useEffect(() => {
    const checkAccess = async () => {
      try {
        const session = await fetchAuthSession();
        const roles = session.tokens.idToken.payload['cognito:groups'];
        if (roles?.includes('petOwners')) {
          setHasAccess(true); // Set access if user is a pet owner
        }
      } catch (error) {
        console.error("Error checking access:", error);
      }
    };

    checkAccess();
  }, []); // This runs once on component mount

  if (!hasAccess) {
    return <Box>You do not have access to this page.</Box>;
  }

  return (
    <Box padding="4">
      <Text fontSize="2xl">Welcome to My Pets, {user.username}!</Text>
      {/* MyPets component content here */}
    </Box>
  );
}

export default MyPets;
