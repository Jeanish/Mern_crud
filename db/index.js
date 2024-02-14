// DataBase connection
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const DBconnect = await mongoose.connect(process.env.MONGODB_URI, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
    console.log(
      "Database Connected SuccessFully at " + DBconnect.connection.host
    );
  } catch (error) {
    console.log("Connection Error At /db/index.js -----> ", error);
  }
};

export default connectDB;
