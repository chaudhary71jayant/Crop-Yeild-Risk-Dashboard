
import express from "express";
import districtRoutes from "./src/routes/districts.routes.js";

const app = express();
const PORT = 8080;



app.get('/', (req,res) => {
    res.send("The server is running bro.");
});

app.use('/api/v1',districtRoutes);




app.listen(PORT , () => {
    console.log(`The server is Listening at http://localhost:${PORT}`);
});