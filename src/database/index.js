import mongoose from "mongoose";

const connectToDB = async () => {
  const url =
    "mongodb+srv://sakethsampath2006:YiPVPYJsjuJLPKVT@cluster0.iki08.mongodb.net/";

  mongoose
    .connect(url)
    .then(() => console.log("Auth database connected successfully"))
    .catch((error) => console.log(error));
};

export default connectToDB;
