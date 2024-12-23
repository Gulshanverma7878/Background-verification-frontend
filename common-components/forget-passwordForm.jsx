// "use client";
// import React, { useState } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { TextField, Button, Grid, Typography, CircularProgress, Box, Container } from "@mui/material";
// import { FaUser, FaLock } from "react-icons/fa";
// import { _createlogin } from "../utils/apiUtils";
// import Logo from "./header-components/Logo";
// import {BASE_URL,_update} from '@/utils/apiUtils';

// const LoginPage = () => {


//   const [formData, setFormData] = useState({
//     password: "",
//     currentpassword: "",
//   });
//   const urlParams = new URLSearchParams(window.location.search);
//   const id = urlParams.get('id');

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const router = useRouter();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevState) => ({
//       ...prevState,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if(formData.password!==formData.currentpassword){
//         alert("password not matched")
//     }
//     else{
//       const dataToSend = {
//         ...formData,
//         id: id, // Add the id to the form data
//       };
//       const response = await fetch("https://background-verification-ozpv.onrender.com/users/reset", {
//         method: "put", 
//         headers: {
//           "Content-Type": "application/json" 
//         },
//         body: JSON.stringify(dataToSend)
//   });
//   if(response.ok){
//     window.location.href="/"
//   }

//   else if(response.status==403){
//     alert("LINK EXPIRED ")
//   }
//   else{
//     alert("something went wrong ")
//   }
        
//   }
//   }
//   return (
//     <Container maxWidth="sm" sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fa' }}>
//       <Box
//         sx={{
//           padding: 4,
//           backgroundColor: '#ffffff',
//           borderRadius: 2,
//           boxShadow: 3,
//           width: '100%',
//           maxWidth: 400,
//           textAlign: 'center',
//         }}
//       >
//         <Logo sx={{ mb: 4 }} />
//         <Typography
//           variant="h4"
//           gutterBottom
//           sx={{ fontWeight: 'bold', color: '#1976d2' }}
//         >
//           <br />
//           Reset Password
//         </Typography>
//         <form onSubmit={handleSubmit}>
//           <TextField
//             fullWidth
//             margin="normal"
//             id="password"
//             name="password"
//             label="password"
//             variant="outlined"
//             value={formData.password}
//             onChange={handleChange}
//             InputProps={{
//               startAdornment: <FaUser style={{ marginRight: 8 }} />,
//             }}
//             sx={{
//               backgroundColor: '#f0f2f5',
//               fontSize: '0.9rem',
//               mb: 2,
//             }}
//           />
//           <TextField
//             fullWidth
//             margin="normal"
//             id="currentpassword"
//             name="currentpassword"
//             label="Current Password"
//             type="password"
//             variant="outlined"
//             value={formData.currentpassword}
//             onChange={handleChange}
//             InputProps={{
//               startAdornment: <FaLock style={{ marginRight: 8 }} />,
//             }}
//             sx={{
//               backgroundColor: '#f0f2f5',
//               fontSize: '0.9rem',
//               mb: 2,
//             }}
//           />
//           {loading ? (
//             <CircularProgress size={24} sx={{ marginTop: 2 }} />
//           ) : (
//             <Button
//               type="submit"
//               fullWidth
//               variant="contained"
//               color="primary"
//               sx={{ fontSize: '0.9rem', marginTop: 2 }}
//             >
//               Reset Password
//             </Button>
//           )}
//         </form>
//         {error && (
//           <Typography variant="body2" color="error" sx={{ mt: 2 }}>
//             {error}
//           </Typography>
//         )}
//         <Typography variant="body2" sx={{ mt: 2 }}>
//           <span> if password remember </span>
//           <Link href="/auth/login">
//             <span style={{ textDecoration: 'none', color: '#1976d2' }}>
//              Login
//             </span>
//           </Link>
//         </Typography>
//       </Box>
//     </Container>
//   );
// };

// export default LoginPage;


"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  TextField,
  Button,
  Typography,
  CircularProgress,
  Box,
  Container,
} from "@mui/material";
import { FaUser, FaLock } from "react-icons/fa";
import Logo from "./header-components/Logo";



// import { TextField, Button, Grid, Typography, CircularProgress, Box, Container } from "@mui/material";
// import { FaUser, FaLock } from "react-icons/fa";
import { _createlogin } from "../utils/apiUtils";
// import Logo from "./header-components/Logo";
import {BASE_URL,_update} from '@/utils/apiUtils';


const LoginPage = () => {
  const [formData, setFormData] = useState({
    password: "",
    currentpassword: "",
  });
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Access URL parameters only on the client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const userId = urlParams.get("id");
      setId(userId);
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.currentpassword) {
      alert("Password does not match");
    } else {
      const dataToSend = {
        ...formData,
        id,
      };

      try {
        const response = await fetch(
          "https://background-verification-ozpv.onrender.com/users/reset",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(dataToSend),
          }
        );
        if (response.ok) {
          window.location.href = "/";
        } else if (response.status === 403) {
          alert("Link expired");
        } else {
          alert("Something went wrong");
        }
      } catch (error) {
        console.error(error);
        alert("An error occurred. Please try again.");
      }
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f8f9fa",
      }}
    >
      <Box
        sx={{
          padding: 4,
          backgroundColor: "#ffffff",
          borderRadius: 2,
          boxShadow: 3,
          width: "100%",
          maxWidth: 400,
          textAlign: "center",
        }}
      >
        <Logo sx={{ mb: 4 }} />
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: "bold", color: "#1976d2" }}
        >
          <br />
          Reset Password
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            id="password"
            name="password"
            label="Password"
            variant="outlined"
            value={formData.password}
            onChange={handleChange}
            InputProps={{
              startAdornment: <FaUser style={{ marginRight: 8 }} />,
            }}
            sx={{
              backgroundColor: "#f0f2f5",
              fontSize: "0.9rem",
              mb: 2,
            }}
          />
          <TextField
            fullWidth
            margin="normal"
            id="currentpassword"
            name="currentpassword"
            label="Current Password"
            type="password"
            variant="outlined"
            value={formData.currentpassword}
            onChange={handleChange}
            InputProps={{
              startAdornment: <FaLock style={{ marginRight: 8 }} />,
            }}
            sx={{
              backgroundColor: "#f0f2f5",
              fontSize: "0.9rem",
              mb: 2,
            }}
          />
          {loading ? (
            <CircularProgress size={24} sx={{ marginTop: 2 }} />
          ) : (
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ fontSize: "0.9rem", marginTop: 2 }}
            >
              Reset Password
            </Button>
          )}
        </form>
        {error && (
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
        <Typography variant="body2" sx={{ mt: 2 }}>
          <span>If you remember the password </span>
          <Link href="/auth/login">
            <span style={{ textDecoration: "none", color: "#1976d2" }}>
              Login
            </span>
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default LoginPage;

