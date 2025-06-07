import { connect, disconnect} from "mongoose"
async function connectToDatabse(){
    try {
        await connect(process.env.MONGODB_URL as string);
    } catch (error) {
        console.error("❌ Failed to connect to MongoDB:", error);
        throw new Error("cannot connect to db!");
    }
}

async function disconnectFromDatabse(){
    try {
        await disconnect();
    } catch (error) {
        console.error("❌ Failed to disconnect from MongoDB:", error);
        throw new Error("cannot disconnect from db!");
    }
}

export{connectToDatabse, disconnectFromDatabse};