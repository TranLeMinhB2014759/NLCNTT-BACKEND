
const express = require("express");
const cors = require("cors");
require('dotenv').config();
// Import các lớp dịch vụ cho các bảng dữ liệu
const StaffSRouter = require("./app/routes/staff.route");
const MedicineSRouter = require("./app/routes/medicine.router");
const DoctorSRouter = require("./app/routes/doctor.router");
const DiseaseSRouter = require("./app/routes/disease.router");
const ServiceSRouter = require("./app/routes/service.router");
const RoomSRouter = require("./app/routes/room.router")
const PatientSRouter = require("./app/routes/patient.router");
const MedicalrecordSRouter = require("./app/routes/medicalrecord.router");
const BillSRouter = require("./app/routes/bill.router");
const AppointmentSRouter = require("./app/routes/appointment.router");
const UploaderSRouter = require("./app/routes/upload.router");

const ApiError = require("./app/api-error");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/staffs", StaffSRouter);
app.use("/api/medicines", MedicineSRouter);
app.use("/api/doctors", DoctorSRouter);
app.use("/api/diseases", DiseaseSRouter);
app.use("/api/services", ServiceSRouter);
app.use("/api/rooms", RoomSRouter);
app.use("/api/patients", PatientSRouter);
app.use("/api/medicalrecords", MedicalrecordSRouter);
app.use("/api/bills", BillSRouter);
app.use("/api/appointments", AppointmentSRouter);
app.use("/api/images", UploaderSRouter)


// Xử lý lỗi 404 - Không Tìm thấy tài nguyên
app.use((req, res, next) => {
    return next(new ApiError(404, "Resource not found"));
});


app.use((error, req, res, next) => {
    return res.status(error.statusCode || 500).json({
        message: error.message || "Internal Server Error",
    });
});

app.get("/", (req, res) => {
    res.json({message: "Wellcome to clinic application"});

});

module.exports = app;
