import React, { useState } from 'react';
import { getCurrentUser } from 'aws-amplify/auth';
import {
  Box, Text, Button, FormControl, FormLabel, Input, Textarea, useToast, AlertDialog,
  AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay
} from '@chakra-ui/react';
function Booking({user}) {
  const [date, setDateAndTime] = useState('');
  const [petId, setPetId] = useState('');
  const [petAge, setPetAge] = useState('');
  const [petBreed, setPetBreed] = useState('');
  const [petName, setPetName] = useState('');
  const [reason, setReason] = useState('');
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertTitle, setAlertTitle] = useState('');
  const onClose = () => setIsAlertOpen(false);
  const cancelRef = React.useRef();
  const toast = useToast();

  const checkPet = async () => {
    try {
      console.log(user.username);
      const response = await fetch(`https://al8ov7f63c.execute-api.eu-west-1.amazonaws.com/dev/isOwner?userId=${user.username}&petId=${petId}`);
      const data = await response.json();
      if (response.ok && data && Object.keys(data).length !== 0) {
        setPetAge(data.petAge || '');
        setPetBreed(data.petBreed || '');
        setPetName(data.petName || '');
        console.log('Pet exists with user id');
      } else {
        setAlertTitle('Pet Check');
        setAlertMessage('No pet exists, please input relevant pet information before submitting.');
        setIsAlertOpen(true);
        setPetAge('');
        setPetBreed('');
        setPetName('');
        console.log('Pet does not exist with user id');
      }
    } catch (error) {
      console.log("in catch")
      toast({
        title: 'Error',
        description: 'Failed to fetch pet details',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    const bookingDetails = {
      date,
      userId: user.username,
      petId,
      info: {
        petAge,
        petBreed,
        petName,
      },
      reason
    };

    try {
      console.log(JSON.stringify(bookingDetails));
      const response = await fetch('https://zznn4f3szj.execute-api.eu-west-1.amazonaws.com/dev/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingDetails)
      });
      
      const data = await response.json();

      if (response.ok) {
        // Handle different status messages from the API
        console.log(data);
        if (data.message === 'Step Function execution started successfully') {
          setAlertTitle('Booking Notified');
          setAlertMessage('Thanks for submitting a booking request. You may recieve a subscription notification, please accept that to confirm your booking.');
          setIsAlertOpen(true);
        } else if (data.status === 'Email notification sent') {
          setAlertTitle('Booking Confirmed');
          setAlertMessage('A confirmation email will be sent shortly.');
          setIsAlertOpen(true);
        } else {
          throw new Error('Unexpected response status');
        }
      } else {
        throw new Error('Failed to book appointment');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || "Failed to book the appointment",
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={4} maxW="500px" mx="auto">
      <Text fontSize="2xl" mb="8">Book Your Appointment</Text>
      <form onSubmit={handleSubmit}>
        <FormControl isRequired mb="4">
          <FormLabel>Date and Time</FormLabel>
          <Input type="datetime-local" value={date} onChange={e => setDateAndTime(e.target.value)} />
        </FormControl>
        <FormControl isRequired mb="4">
          <FormLabel>Pet ID</FormLabel>
          <Input type="text" value={petId} onChange={e => setPetId(e.target.value)} />
          <Button mt="2" colorScheme="blue" onClick={checkPet} isDisabled={!petId}>Check Pet</Button>
        </FormControl>
        <FormControl mb="4">
          <FormLabel>Pet Age</FormLabel>
          <Input type="number" value={petAge} onChange={e => setPetAge(e.target.value)} />
        </FormControl>
        <FormControl mb="4">
          <FormLabel>Pet Breed</FormLabel>
          <Input type="text" value={petBreed} onChange={e => setPetBreed(e.target.value)} />
        </FormControl>
        <FormControl mb="6">
          <FormLabel>Pet Name</FormLabel>
          <Input type="text" value={petName} onChange={e => setPetName(e.target.value)} />
        </FormControl>
        <FormControl isRequired mb="6">
          <FormLabel>Reason for Booking</FormLabel>
          <Textarea value={reason} onChange={e => setReason(e.target.value)} />
        </FormControl>
        <Button type="submit" colorScheme="blue" width="full">Submit</Button>
      </form>
      <AlertDialog
        isOpen={isAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {alertTitle}
            </AlertDialogHeader>
            <AlertDialogBody>
              {alertMessage}
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Close
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}

export default Booking;
