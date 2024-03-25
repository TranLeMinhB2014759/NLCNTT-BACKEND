const { ObjectId } = require("mongodb");
const ApiError = require("../api-error");
const DoctorService = require("../services/doctor.service");
const MongoDB = require("../utils/mongodb.util");

exports.create = async (req, res, next) => {
  if (!req.body?.name ) {
    return next(new ApiError(400, "Name are required fields"));
  }
  try {
    const doctorService = new DoctorService(MongoDB.client);

    // const nameExists = await doctorService.nameExists(req.body.name);
    // if (nameExists) {
    //   return next(new ApiError(400, "Doctor already exists"));
    // }

    const document = await doctorService.create(req.body);
    return res.send(document);
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "An error occurred while creating a doctor"));
  }
};

exports.findDoctorById = async (req, res, next) => {
  try {
    const doctorService = new DoctorService(MongoDB.client);
    const document = await doctorService.findDoctorById(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Doctor not found"));
    }
    return res.send(document);
  } catch (error) {nameExists
    console.log(error);
    return next(
      new ApiError(500, `Error retrieving doctor with id=${req.params.id}`)
    );
  }
};

exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Data to update can't be empty"));
  }
  try {
    const doctorService = new DoctorService(MongoDB.client);
    
    // const nameExists = await doctorService.nameExists(req.body.name);
    // if (nameExists) {
    //   return next(new ApiError(400, "Name already exists"));
    // }

    const document = await doctorService.update(req.params.id, req.body);
    if (!document) {
      return next(new ApiError(404, "Doctor not found"));
    }
    return res.send({ message: "Doctor was updated successfully" });
  } catch (error) {
    return next(
      new ApiError(500, `Error updating doctor with id=${req.params.id}`)
    );
  }
};

exports.delete = async (req, res, next) => {
  try {
    const doctorService = new DoctorService(MongoDB.client);
    const document = await doctorService.delete(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Doctor not found"));
    }
    return res.send({ message: "Doctor was deleted successfully" });
  } catch (error) {
    return next(
      new ApiError(500, `Error deleting doctor with id=${req.params.id}`)
    );
  }
};

exports.findAll = async (req, res, next) => {
  let documents = [];
  try {
    const doctorService = new DoctorService(MongoDB.client);
    const { name } = req.query;
    if (name) {
      documents = await doctorService.findByName(name);
    } else {
      documents = await doctorService.find({});
    }
  } catch (error) {
    console.log(error);
    return next(
      new ApiError(500, "An error occurred while retrieving contacts")
    );
  }
  return res.send(documents);
};

exports.deleteAll = async (req, res, next) => {
  try {
    const doctorService = new DoctorService(MongoDB.client);
    const deletedCount = await doctorService.deleteAll();
    return res.send({
      message: `${deletedCount} doctors was deleted successfully`,
    });
  } catch (error) {
    return next(
      new ApiError(500, "An error occurred while removing all doctors")
    );
  }
};

