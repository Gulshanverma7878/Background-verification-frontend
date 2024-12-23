import React, { useState, useEffect } from 'react';
import { Button, Modal, Grid } from '@mui/material';
import { BsPlus, BsDownload } from 'react-icons/bs';
import InternalTeamList from "./InternalTeamList";
import NewTeamForm from "./NewTeamForm";
import { _getAll } from '@/utils/apiUtils'; 

function TeamContext() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [teamListData, setTeamListData] = useState([]);

    useEffect(() => {
        updateTeamList(); 
    }, []);

    const handleOpenModal = (team) => {
        setSelectedTeam(team);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedTeam(null);
        setIsModalOpen(false);
    };

    const updateTeamList = async () => {
        try {
            const data = await _getAll('/internal-team');
            setTeamListData(data);
        } catch (error) {
            console.error('Failed to fetch team data. Please try again later.', error);
        }
    };

    // Function to handle CSV download
    const handleDownloadCSV = () => {
        if (teamListData.length === 0) {
            alert('No data available to download.');
            return;
        }

        const headers = Object.keys(teamListData[0]); // Get headers for CSV from the first object keys
        const csvRows = [
            headers.join(","), // Header row
            ...teamListData.map((row) =>
                headers.map((header) => `"${row[header] || ""}"`).join(",")
            ),
        ];

        const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "teams.csv");
        document.body.appendChild(link); // Required for FF
        link.click();
        document.body.removeChild(link);
    };

    return (
        <>
            <div style={{ display: 'flex', justifyContent: "space-between" }}>
                <div style={{ margin: "10px" }}>
                    {/* Placeholder for additional buttons or elements */}
                </div>

                <div style={{ display: 'flex' }}>
                    <div style={{ margin: "10px" }}>
                        <Button
                            variant="contained"
                            startIcon={<BsDownload style={{ fontSize: '1.2em' }} />}
                            onClick={handleDownloadCSV} // Attach CSV download handler
                        >
                            Download as Excel
                        </Button>
                    </div>
                    <div style={{ margin: "10px" }}>
                        <Button
                            variant="contained"
                            startIcon={<BsPlus style={{ fontSize: '1.2em' }} />}
                            onClick={() => handleOpenModal(null)}
                        >
                            New Team
                        </Button>
                    </div>
                </div>
            </div>
            <InternalTeamList 
                teamListData={teamListData}
                onEdit={handleOpenModal} 
                onAdd={handleOpenModal} 
                updateTeamList={updateTeamList} 
            />
            <Modal
                open={isModalOpen}
                onClose={handleCloseModal}
            >
                <Grid>
                    <Grid>
                        <NewTeamForm 
                            team={selectedTeam} 
                            onClose={handleCloseModal} 
                            updateTeamList={updateTeamList} 
                        />
                    </Grid>
                </Grid>
            </Modal>
        </>
    );
}

export default TeamContext;