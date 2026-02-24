const mongoose = require("mongoose");

module.exports.connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Da ket noi co so du lieu")
    } catch(err)
    {
        console.log(err)
    }
}