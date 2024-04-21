import React, { useState, useEffect } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';
import { BrowserRouter as Router, Routes, Route, Link as RouterLink } from 'react-router-dom';
import { Box, Flex, Button, Text, Link } from '@chakra-ui/react';

import Mypets from './my_pets';
import Booking from './booking';
import Report from './pet_report';
import Management from './management';

function Dashboard({ user, signOut, role }) {
  // Initialize state variables
  const [isPetOwner, setIsPetOwner] = useState(false);
  const [isSecretary, setIsSecretary] = useState(false);
  const [isVet, setIsVet] = useState(false);

  // Effect hook to handle session fetching and state updating
  useEffect(() => {
    const handleSession = async () => {
      try {
        const resolvedValue = await fetchAuthSession(); // Wait for the promise to resolve
        const temp = resolvedValue.tokens.idToken.payload['cognito:groups'];
        setIsPetOwner(temp?.includes('petOwners')); // Check if the user is a pet owner
        setIsSecretary(temp?.includes('secretary')); // Check if the user is a secretary
        setIsVet(temp?.includes('veterinarians')); // Check if the user is a veterinarian
      } catch (error) {
        console.error("Promise failed:", error);
      }
    };

    handleSession();
  }, []); // Empty dependency array means this effect runs once on mount


  return (
    <Box padding="4">
      <Text fontSize="2xl">Welcome to the Dashboard, {user.username}!</Text>
      {/* Conditional rendering based on roles */}
      {isPetOwner && <Text>You have pet owner access.</Text>}
      {isSecretary && <Text>You have secretary access.</Text>}
      {isVet && <Text>You have veterinarian access.</Text>}
      {/* Add more dashboard-specific content here */}
      {(isPetOwner || isSecretary) && (
        <Button colorScheme="blue" as={RouterLink} to="/booking">
          Book Appointment
        </Button>
      )}
      

    </Box>
  );
}



export default Dashboard;