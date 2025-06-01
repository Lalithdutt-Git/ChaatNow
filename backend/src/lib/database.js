import mongoose from "mongoose"


export const connectDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI)
        console.log(`connected to the the database ${connect.connection.host}`)
    } catch (error) {
        console.log("error in connecting to the database",error)
    }
};