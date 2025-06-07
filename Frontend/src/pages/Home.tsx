import TypingAnim from "../components/typer/TypingAnim";
import { Box } from "@mui/material";
import Footer from "../components/footer/Footer";

const Home = () => {
    return (
        <Box width={"100%"} height={"100%"}>
            <Box sx={{display:"flex", width:"100%", flexDirection:"column",alignItems:"center", mx:"auto", }}>
                <Box sx={{mt:4, mx:4}}>
                    <TypingAnim />
                </Box>
                
                <Box sx={{width:"100%", display:"flex",flexDirection:{md:"row", xs:"column"}, my:4, justifyContent:"center", alignItems:"center", marginLeft: "100px",
    marginRight: "100px", }}>
                    <img 
  src="log1.png" 
  alt="robot" 
  style={{
    maxWidth: "250px", 
    filter: "drop-shadow(0px 0px 16px rgba(0,255,252, 0.5))"
  }} 
/>

                </Box>
                <Box sx={{display:"flex", width:"100%", mx:"auto"}}>
                    <img src="log2.png" alt="chat" style={{display:"flex", margin:"auto", width:"70%", height:"70%", borderRadius:20,boxShadow:"0px 0px 75px #64f3d5", marginTop:40,marginBottom:60 }}></img>

                </Box>
                <Footer />
            </Box>
        </Box>
    );
};

export default Home;
