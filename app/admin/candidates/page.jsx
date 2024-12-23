// Condidate.jsx

"use client";

import * as React from 'react';
import CustomButton from "@/common-components/CustomButton";
import Layout from "../../../admin-components/Layout";
import { BsDownload, BsPlus } from "react-icons/bs";
import Link from "next/link";
import CandidateList from "../candidates/candidates-components/CandidateList";
import { Button } from '@mui/material';

const Condidate = () => {
    const [candidateData, setCandidateData] = React.useState([]); // State to store candidate data
    const handleDataLoad = (data) => {
        setCandidateData(data);
    };
    const handleDownload = () => {
        if (candidateData.length === 0) {
            alert('No data available to download.');
            return;
        }

        const headers = Object.keys(candidateData[0]); // Getting headers for CSV from the first object keys
        const csvRows = [
            headers.join(","), // header row
            ...candidateData.map((row) =>
                headers.map((header) => `"${row[header] || ""}"`).join(",")
            ),
        ];

        const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "candidates.csv");
        document.body.appendChild(link); // Required for FF
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Layout>
            <div className="container-fluid" style={{ minHeight: "100vh" }}>
                <div className="container">
                    <div style={{ display: 'flex', justifyContent: "space-between" }}>
                        <div style={{ margin: "10px" }}></div>

                        <div style={{ display: 'flex' }}>
                            <div style={{ margin: "10px" }}>
                                <Button
                                    variant="contained"
                                    startIcon={<BsDownload style={{ fontSize: '1.2em' }} />}
                                    onClick={handleDownload} // Click handler for CSV download
                                >
                                    Download as Excel
                                </Button>
                            </div>
                            <div style={{ margin: "10px" }}>
                                <Link href="/admin/candidates/add-candidates" passHref style={{ textDecoration: "none" }}>
                                    <div>
                                        <Button
                                            variant="contained"
                                            startIcon={<BsPlus style={{ fontSize: '1.2em' }} />}
                                        >
                                            ADD NEW CANDIDATE
                                        </Button>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <CandidateList onDataLoad={handleDataLoad} /> {/* Passing the data loading handler */}
                </div>
            </div>
        </Layout>
    );
};

export default Condidate;
