import app from "./app.js";
import { connectToDatabse, disconnectFromDatabse} from "./db/connection.js"

//connections and listeners
const PORT = process.env.PORT || 5000;
connectToDatabse().then(()=>{
    app.listen(PORT, () => {
        console.log(`✅ Server running at http://localhost:${PORT} & connected to database!`);
    });
}).catch((err)=>console.log(err));

