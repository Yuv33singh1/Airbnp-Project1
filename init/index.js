const mongoose =  require("mongoose");
const initData = require("./data.js");
const listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
async function main() {
    await mongoose.connect(MONGO_URL);
}

main().then(() =>{
    console.log("connected to db");
}).catch((err) =>{
    console.log(err);
});

const initDB = async () =>{
    await listing.deleteMany({});
    initData.data = initData.data.map((obj) =>({...obj, owner:'6673d7142578cf5b07359d3b'}));
    await listing.insertMany(initData.data);
    console.log("data was initlialized");


}
initDB();