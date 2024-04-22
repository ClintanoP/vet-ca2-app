import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { fetchAuthSession } from 'aws-amplify/auth';
import { BrowserRouter as Router, Routes, Route, Link as RouterLink } from 'react-router-dom';
import { Box, Flex, Button, Text, Link, SimpleGrid, Card, Textarea } from '@chakra-ui/react';

function Dashboard({ user, signOut, role }) {
  const [isPetOwner, setIsPetOwner] = useState(false);
  const [isSecretary, setIsSecretary] = useState(false);
  const [isVet, setIsVet] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [reports, setReports] = useState([]);
  const [reportDetails, setReportDetails] = useState({});

  useEffect(() => {
    const handleSession = async () => {
      try {
        const resolvedValue = await fetchAuthSession();
        const temp = resolvedValue.tokens.idToken.payload['cognito:groups'];
        setIsPetOwner(temp?.includes('petOwners'));
        setIsSecretary(temp?.includes('secretary'));
        setIsVet(temp?.includes('veterinarians'));
        fetchData();
      } catch (error) {
        console.error("Promise failed:", error);
      }
    };

    const fetchData = async () => {
      try {
        const appointmentsResponse = await axios.get('https://zznn4f3szj.execute-api.eu-west-1.amazonaws.com/dev/appointments');
        const reportsResponse = await axios.get('https://u512yyphlj.execute-api.eu-west-1.amazonaws.com/dev/reports');
    
        // Create a mapping from reportId to appointmentId
        const reportToAppointmentMap = appointmentsResponse.data.reduce((map, appointment) => {
          map[appointment.reportId] = appointment.id;
          return map;
        }, {});
    
        // Add appointmentId to each report
        const updatedReports = reportsResponse.data.map(report => ({
          ...report,
          appointmentId: reportToAppointmentMap[report.id] // Add appointmentId using the map
        }));
    
        setAppointments(appointmentsResponse.data);
        setReports(updatedReports);
    
        // Initialize editable details for each report
        let initialDetails = {};
        updatedReports.forEach(report => {
          initialDetails[report.id] = report.details || '';
        });
        setReportDetails(initialDetails);
      } catch (error) {
        console.error("Failed to fetch data:", error.message);
      }
    };
    
    

    handleSession();
  }, []);

  const handleDetailChange = (id, value) => {
    setReportDetails(prevDetails => ({
      ...prevDetails,
      [id]: value
    }));
  };

  const updateDetails = async (reportId, details) => {
    const report = reports.find(r => r.id === reportId);
    if (!report || !report.appointmentId) {
      console.error("No appointment associated with this report.");
      alert("Failed to find associated appointment!");
      return;
    }
  
    const payload = {
      appId: report.appointmentId,
      details: details
    };
  
    console.log("Sending payload:", payload);  // Debug statement to print the payload
  
    try {
      const response = await axios.put('https://u512yyphlj.execute-api.eu-west-1.amazonaws.com/dev/reports', payload);
      console.log("Response:", response.data);  // Optionally print the response for more debugging
      alert('Details updated successfully!');
    } catch (error) {
      console.error("Failed to update details:", error.message);
      alert('Failed to update details.');
    }
  };
  
  

  return (
    <Box padding="4">
      <Text fontSize="2xl">Welcome to the Dashboard, {user.username}!</Text>
      {isPetOwner && <Text>You have pet owner access.</Text>}
      {isSecretary && <Text>You have secretary access.</Text>}
      {isVet && <Text>You have veterinarian access.</Text>}
      {(isPetOwner || isSecretary) && (
        <Button colorScheme="blue" as={RouterLink} to="/booking">
          Book Appointment
        </Button>
      )}
      <SimpleGrid columns={3} spacing={5}>
        {appointments.map(appointment => (
          <Box key={appointment.id} p={5} shadow='md' borderWidth='1px'>
            <Text>Appointment</Text>
            <Text>Date: {appointment.date}</Text>
            <Text>Pet ID: {appointment.petId}</Text>
            <Text>Follow Up: {appointment.follow_up}</Text>
            <Text>Reason: {appointment.reason}</Text>
          </Box>
        ))}
        {reports.map(report => (
          <Box key={report.id} p={5} shadow='md' borderWidth='1px'>
            <Text>Report</Text>
            <Text>Date: {report.date}</Text>
            <Text>Pet ID: {report.petId}</Text>
            <Textarea
              value={reportDetails[report.id]}
              onChange={(e) => handleDetailChange(report.id, e.target.value)}
              placeholder="Enter details"
            />
            <Button mt={2} colorScheme="blue" onClick={() => updateDetails(report.id, reportDetails[report.id])}>
              Update Details
            </Button>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
}

export default Dashboard;
