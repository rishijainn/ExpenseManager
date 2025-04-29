const express=require("express");
require('dotenv').config();
const {connection}=require("./connect");
const {auth}=require("./middleware/userAuth");
const cookieParser=require("cookie-parser");
const cors=require("cors"); 
const path =require("path")

const OpRouter=require("./routes/opRoutes");

const userRouter=require("./routes/userRoutes");
const portNo=process.env.portNo;
const url=process.env.dbUrl;

const app=express();

connection(url).then(()=>{
    console.log("database connected successfully")
}).catch((error)=>{
    console.log("there is some issue in connecting database")
})
app.use(cors({
    origin: 'https://expense-manager-frontend-six.vercel.app/', // Frontend URL
    credentials: true, // Allow cookies to be sent
}));
const _dirname=path.resolve();

app.use(express.json());
app.use(cookieParser());

app.use("/user",userRouter);

app.use("/user/data",auth,OpRouter);


app.use(express.static(path.join(_dirname,"/client/build")));
app.get('*',(req,res)=>{
    res.sendFile(path.resolve(_dirname, "client", "build" ,"index.html"));
})

app.listen(portNo,()=>{
    console.log("server started on port no ",portNo);
})