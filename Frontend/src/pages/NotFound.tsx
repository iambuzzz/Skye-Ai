import { Box, Typography } from "@mui/material";
import Footer from "../components/footer/Footer";

const NotFound = () => {
    return (
        <Box
            sx={{
                width: "100%",
                height: "100vh", // Full viewport height
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#000", // or your theme's background color
                color: "#fff", // or your theme's text color
                textAlign: "center",
            }}
        >
            <Typography variant="h1" sx={{ fontWeight: "bold", mb: 2, color: "#64f3d5", textShadow: "0px 0px 10px #64f3d5" }}>
                404 - Not Found
            </Typography>
            <Typography variant="h5" sx={{ mb: 4, color: "rgba(255, 255, 255, 0.7)" }}>
                Oops! The page you're looking for could not be found.
            </Typography>

            <img
                src="log1.png" // Replace with a suitable image for 404 (e.g., a broken robot)
                alt="Not Found"
                style={{
                    maxWidth: "200px", // Adjust size as needed
                    filter: "drop-shadow(0px 0px 16px rgba(0,255,252, 0.5))",
                    marginBottom: "20px",
                    animation: 'float 3s infinite alternate', // Add floating animation

                }}
            />

            {/* Optional: Link back to homepage */}
            {/* Make sure you have React Router or similar installed */}
            {/*<Link to="/" style={{ color: "#64f3d5", textDecoration: "none", fontWeight: "bold" }}>
                Go back to the homepage
            </Link>*/}

             <Box sx={{marginTop: 4, display:"flex", flexDirection: "column", alignItems:"center"}}>
                <Typography variant="body1" sx={{color: "rgba(255, 255, 255, 0.7)"}}>
                  Try checking the URL or using the search bar.
                </Typography>
              {/* Add your search bar component here if you have one*/}

            </Box>


            <Box sx={{marginTop: "50px"}}>
                <Footer />
            </Box>

             {/* Keyframes for floating animation */}
            <style>
              {`
                @keyframes float {
                  0% {
                    transform: translateY(0);
                  }
                  100% {
                    transform: translateY(-20px);
                  }
                }
              `}
            </style>
        </Box>
    );
};

export default NotFound;