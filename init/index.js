const mongoose=require("mongoose");
const initData=require("./data.js");
const listing=require("../models/listing.js");

async function main()
{
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

main()
.then((res)=>
{
    console.log("connected");
})
.catch((err)=>
{
    console.log(err);
});

async function initDB()
{
    await listing.deleteMany({});
    console.log(initData);
    initData.data=initData.data.map((obj)=>({...obj,owner:"65f597f68556a2fea32d91d2"}));
    await listing.insertMany(initData.data);
    // console.log("data was done");
}
initDB();
