"use client";
import React, { useState, useEffect } from "react";
import { Button, Modal, Grid, CircularProgress } from "@mui/material";
import { BsPlus, BsDownload } from "react-icons/bs";
import NewClientForm from '../../app/admin/companies/companies-components/NewClientForm';
import CompaniesList from '../../app/admin/companies/companies-components/CompaniesList';
import { _getAll } from "@/utils/apiUtils";

import Link from "next/link";

function DashboardBody({ onDataLoad }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientListData, setClientListData] = useState([]);
  const [loadingData, setLoadingData] = useState(false); // State for loading data
  const [loadingModal, setLoadingModal] = useState(false); // State for loading modal open

  useEffect(() => {
    updateCandidateListByClientId();
  }, []);

  const handleOpenModal = async (client) => {
    try {
      setLoadingModal(true); // Set loading state for opening modal
      setSelectedClient(client);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Failed to open modal:", error);
    } finally {
      setLoadingModal(false); // Clear loading state
    }
  };

  const handleCloseModal = () => {
    setSelectedClient(null);
    setIsModalOpen(false);
  };

  const updateCandidateListByClientId = async () => {
    try {
      setLoadingData(true); // Set loading state
      const response = await _getAll(`/client`);
      setClientListData(response);
    } catch (error) {
      console.error(
        "Failed to fetch client data. Please try again later.",
        error
      );
    } finally {
      setLoadingData(false); // Clear loading state
    }
  };

  const handleNewCompanyClick = () => {
    handleOpenModal(null);
  };

  // Function to download data as CSV
  const handleDownloadCSV = () => {
    if (clientListData.length === 0) {
      alert('No data available to download.');
      return;
    }

    const headers = Object.keys(clientListData[0]); // Getting headers for CSV from the first object keys
    const csvRows = [
      headers.join(","), // header row
      ...clientListData.map((row) =>
        headers.map((header) => `"${row[header] || ""}"`).join(",")
      ),
    ];

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "clients.csv");
    document.body.appendChild(link); // Required for FF
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ margin: "10px" }}>
          {/* Placeholder for additional buttons or elements */}
        </div>

        <div style={{ display: "flex" }}>
          <div style={{ margin: "10px" }}>
            <Button
              variant="contained"
              startIcon={<BsDownload style={{ fontSize: "1.2em" }} />}
              onClick={handleDownloadCSV} // Click handler for CSV download
              disabled={loadingData} // Disable button while loading data
            >
              {loadingData ? <CircularProgress size={24} /> : "Download as Excel"}
            </Button>
          </div>
          <div style={{ margin: "10px" }}>
            <Button
              variant="contained"
              startIcon={<BsPlus style={{ fontSize: "1.2em" }} />}
              onClick={handleNewCompanyClick}
              disabled={loadingModal} // Disable button while loading modal
            >
              {loadingModal ? <CircularProgress size={24} /> : "New Company"}
            </Button>
          </div>
        </div>
      </div>
      <CompaniesList
        clientListData={clientListData}
        onEdit={handleOpenModal}
        onAdd={handleOpenModal}
        updateClientList={updateCandidateListByClientId}
      />
      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Grid>
          <Grid>
            <NewClientForm
              client={selectedClient}
              onClose={handleCloseModal}
              updateClientList={updateCandidateListByClientId}
            />
          </Grid>
        </Grid>
      </Modal>
    </>
  );
}

export default DashboardBody;
