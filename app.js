
const express = require("express");
const cors = require("cors");
// Import các lớp dịch vụ cho các bảng dữ liệu
const StaffSRouter = require("./app/routes/staff.route");
const MedicineSRouter = require("./app/routes/medicine.router");
const PatientSRouter = require("./app/routes/patient.router");

const ApiError = require("./app/api-error");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/staffs", StaffSRouter);
app.use("/api/medicines", MedicineSRouter);
app.use("/api/patients", PatientSRouter);


// Xử lý lỗi 404 - Không Tìm thấy tài nguyên
app.use((req, res, next) => {
    return next(new ApiError(404, "Resource not found"));
});

// Xử lý lỗi chung 

app.use((error, req, res, next) => {
    return res.status(error.statusCode || 500).json({
        message: error.message || "Internal Server Error",

    });

});

app.get("/", (req, res) => {
    res.json({message: "Wellcome to clinic application"});

});


module.exports = app;
