import mockDistricts from "../data/mockdata.js";

const getAllDistricts = (req, res) => {
    res.json(mockDistricts);
}

const getDistrictById = (req, res) => {
    try {
        const districtId = parseInt(req.params.id);
        const district = mockDistricts.find(d => d.id === districtId);

        if (!district) {
            return res.status(404).json({
                success: false,
                message: "District not found."
            });
        }

        res.status(200).json({ success: true, district });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
}

const compareDistricts = (req, res) => {
    try {
        const idString = req.query.ids;
        if (!idString) {
            return res.status(400).json({
                success: false,
                message: "Id is not provided."
            });
        }

        const idArray = idString.split(",").map(Number);

        if (idArray.length < 2) {
            return res.status(400).json({
                success: false,
                message: "Please provide two or more ids to compare."
            });
        }

        const districts = mockDistricts.filter(d => idArray.includes(d.id));

        res.json(districts);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong."
        });
    }
};
    
export { getAllDistricts, getDistrictById, compareDistricts};