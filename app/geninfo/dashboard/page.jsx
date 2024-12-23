"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import { Box, Typography, Paper, MenuItem, Select, InputLabel, FormControl, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { CSVLink } from 'react-csv';
import { _getAll } from '@/utils/apiUtils'; // Ensure this import path is correct

const GenInfoDashboard = () => {
  const [rows, setRows] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [popupOpen, setPopupOpen] = useState(false);
  const [candidateDetails, setCandidateDetails] = useState([]);
  const [popupColumns, setPopupColumns] = useState([]);

  // Fetch data from the API
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const data = await _getAll('/candidate');
      // Format the data
      const formattedData = data.map(item => ({
        id: item.id,
        name: item.name,
        mobile_no: item.mobile_no,
        email_id: item.email_id,
        father_name: item.father_name,
        gender: item.gender,
        dob: item.dob,
        postal_id: item.CandidteAddresses[0]?.postal_id || 'N/A',
        full_address: item.CandidteAddresses[0]?.full_address || 'N/A',
        pan_number: item.CandidteCibils[0]?.pan_number || 'N/A',
        aadhar_number: item.CandidteCibils[0]?.aadhar_number || 'N/A',
        ref_email: item.CandidteReferences[0]?.ref_email || 'N/A',
        companyName: item.WorkExperiences[0]?.companyName || 'N/A',
        companyEmail: item.WorkExperiences[0]?.companyEmail || 'N/A',
        status: 'Unverified' // Assuming all fetched candidates start as unverified
      }));
      setRows(formattedData);
    } catch (error) {
      console.error('Failed to fetch data', error);
      setErrorMessage('Failed to fetch data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Handle action button click
  const handleAction = useCallback((event, id) => {
    event.stopPropagation(); // Stop the row from being selected
    setRows(prevRows =>
      prevRows.map(row =>
        row.id === id
          ? { ...row, status: row.status === 'Unverified' ? 'Verified' : 'Unverified' }
          : row
      )
    );
  }, []);

  // Handle view button click
  const handleView = async (id) => {
    let url = '';
    let teamrole = parseInt(localStorage.getItem('teamrole'), 10);
    
    switch (teamrole) {
      case 1:
        url = 'address';
        break;
      case 2:
        url = 'education';
        break;
      case 3:
        url = 'workingExp';
        break;
      case 4:
        url = 'reference';
        break;
      default:
        url = '';
        break;
    }
    
    try {
      const response = await fetch(`http://localhost:8080/candidate-${url}/${id}`);
      const data = await response.json();
      setCandidateDetails(data);
      if (data.length > 0) {
        const columns = Object.keys(data[0]).map(key => ({
          field: key,
          headerName: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '),
          width: 200,
          renderCell: (params) => {
            const value = params.value;
            if (typeof value === 'string' && value.startsWith('/uploads')) {
              return (
                <a href={`http://localhost:8080${value}`} target="_blank" rel="noopener noreferrer">
                  preview
                </a>
              );
            }
            return value;
          }
        }));
        setPopupColumns(columns);
      }
      setSelectedCandidate(id);
      setPopupOpen(true);
    } catch (error) {
      console.error('Failed to fetch candidate details', error);
      setErrorMessage('Failed to fetch candidate details. Please try again later.');
    }
  };

  // Handle status filter change
  const handleStatusChange = (event) => {
    setStatusFilter(event.target.value);
  };

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Filter rows based on status and search query
  const filteredRows = rows.filter(row => {
    const matchesStatus = statusFilter === 'All' || row.status === statusFilter;
    const matchesSearch = row.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           row.email_id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Render cell content function for main table
  const renderCellContent = (params) => {
    const value = params.value;
    console.log(value);
    if (typeof value === 'string' && (value.startsWith('/uploads') || value.startsWith('uploads'))) {
      return (
        <a href={`http://localhost:8080${value}`} target="_blank" rel="noopener noreferrer">
          preview
        </a>
      );
    }
    return value;
  };

  // Define columns for the main DataGrid
  const columns = [
    { field: 'name', headerName: 'Candidate Name', width: 200 },
    { field: 'gender', headerName: 'Candidate Gender', width: 200 },
    { field: 'dob', headerName: 'Candidate DOB', width: 200 },
    { field: 'father_name', headerName: "Father's Name", width: 250 },
    { field: 'mobile_no', headerName: 'Mobile No', width: 200 },
    { field: 'email_id', headerName: 'Email ID', width: 250 },
    { field: 'status', headerName: 'Final Status', width: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 300,
      renderCell: (params) => (
        <>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            onClick={(event) => handleAction(event, params.row.id)}
            sx={{ mr: 1 }}
          >
            {params.row.status === 'Unverified' ? 'Verify' : 'Unverify'}
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => handleView(params.row.id)}
          >
            View
          </Button>
        </>
      ),
    },
  ];

  // Enhance columns with renderCellContent for main table
  const enhancedColumns = columns.map(column => ({
    ...column,
    renderCell: column.field !== 'actions' ? renderCellContent : column.renderCell
  }));

  return (
    <Box sx={{ p: 3, borderRadius: '8px', border: '1px solid #ddd', backgroundColor: '#fff', boxShadow: 2 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 2 }}>
        General Information Dashboard
      </Typography>

      <Paper sx={{ p: 2, mb: 2, display: 'flex', alignItems: 'center', gap: 2, border: '1px solid #ddd', borderRadius: '8px' }}>
        <FormControl variant="outlined" sx={{ minWidth: 200 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            onChange={handleStatusChange}
            label="Status"
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Verified">Verified</MenuItem>
            <MenuItem value="Unverified">Unverified</MenuItem>
          </Select>
        </FormControl>
        <TextField
          variant="outlined"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{ flex: 1 }}
        />
        <CSVLink
          data={filteredRows}
          headers={columns.map((col) => ({ label: col.headerName, key: col.field }))}
          filename={"gen_info_data.csv"}
          style={{ textDecoration: 'none' }}
        >
          <Button variant="contained" color="secondary">
            Export CSV
          </Button>
        </CSVLink>
      </Paper>

      <Paper sx={{ p: 2, borderRadius: '8px', border: '1px solid #ddd' }}>
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={filteredRows}
            columns={enhancedColumns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            checkboxSelection
          />
        </div>
      </Paper>

      {errorMessage && (
        <Paper sx={{ p: 2, mt: 2, backgroundColor: '#f8d7da', color: '#721c24' }}>
          <Typography variant="body1">{errorMessage}</Typography>
        </Paper>
      )}

      <Dialog open={popupOpen} onClose={() => setPopupOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Candidate Details</DialogTitle>
        <DialogContent>
          <div style={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={candidateDetails}
              columns={popupColumns}
              pageSize={5}
              rowsPerPageOptions={[5]}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPopupOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GenInfoDashboard;