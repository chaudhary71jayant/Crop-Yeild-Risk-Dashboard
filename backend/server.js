import express from "express";

const app = express();
const PORT = 8080;

app.get('/', (req,res) => {
    res.send("The server is running bro.");
});

app.listen(PORT , () => {
    console.log(`The server is Listening at http://localhost:${PORT}`);
});