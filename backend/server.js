
import express from "express";

const app = express();
const PORT = 8080;

const mockDistricts = [
  {
    id: 1,
    district: "Nashik",
    state: "Maharashtra",
    crop: "Onion",
    year: 2024,
    riskScore: 72,
    topDrivers: ["Low rainfall", "High price volatility", "Shrinking area"]
  },
  {
    id: 2,
    district: "Ludhiana",
    state: "Punjab",
    crop: "Wheat",
    year: 2024,
    riskScore: 35,
    topDrivers: ["Stable rainfall", "Consistent yield"]
  },
  {
    id: 3,
    district: "Guntur",
    state: "Andhra Pradesh",
    crop: "Chilli",
    year: 2024,
    riskScore: 58,
    topDrivers: ["Price drop", "Moderate rainfall deficit"]
  }
];

app.get('/', (req,res) => {
    res.send("The server is running bro.");
});

app.get('/api/ditricts', (req, res) => {
    res.json(mockDistricts);
})

app.get("/api/district/:id", (req,res) => {
    try {
        const districtId = parseInt(req.params.id);
        const district = mockDistricts.find(d => d.id === districtId);

        if(!district){
            return res.status(404).json({
                success : false,
                message : "The District not found."
            })
        }
        res.json(district);
    } catch (error) {
        console.log("Error fetching district : ", error);
        res.status(500).json({success : false, message : "Something went wrong."})
    }
});

app.get('/api/compare/', (req, res) => {
    try {
        const idString = req.query.ids;
        if(!idString){
            return res.status(400).json({success : false, message :"Provide the valid districts to compare"});
        }
       
        const idArray = idString.split(',').map(Number);

        
        if(idArray.length < 2){
            return res.status(400).json({success : false, message : "BAD REQUEST, Provide atleast 2 district ids."});
        }


        const districts = mockDistricts.filter(d => idArray.includes(d.id));

        res.json(districts);
            
    }
    catch (error) {
        console.log("Error here", error);
        res.status(500).json({
            success : false,
            message : "Something went wrong."
        });
    };
})

app.listen(PORT , () => {
    console.log(`The server is Listening at http://localhost:${PORT}`);
});