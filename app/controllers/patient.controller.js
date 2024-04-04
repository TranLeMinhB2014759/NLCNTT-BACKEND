const { ObjectId } = require("mongodb");
const ApiError = require("../api-error");
const PatientService = require("../services/patient.service");
const MongoDB = require("../utils/mongodb.util");

exports.create = async (req, res, next) => {
  if (!req.body?.name || !req.body?.phoneNumber ) {
    return next(new ApiError(400, "phoneNumber are required fields"));
  }
  try {
    const patientService = new PatientService(MongoDB.client);

    const sdtExists = await patientService.sdtExists(req.body.phoneNumber);
    if (sdtExists) {
      return next(new ApiError(400, "phoneNumber already exists"));
    }

    const document = await patientService.create(req.body);
    return res.send(document);
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "An error occurred while creating a patient"));
  }
};

exports.findPatientById = async (req, res, next) => {
  try {
    const patientService = new PatientService(MongoDB.client);
    const document = await patientService.findPatientById(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Patient not found"));
    }
    return res.send(document);
  } catch (error) {
    console.log(error);
    return next(
      new ApiError(500, `Error retrieving patient with id=${req.params.id}`)
    );
  }
};

exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Data to update can't be empty"));
  }
  try {
    const patientService = new PatientService(MongoDB.client);
    const sdtExists = await patientService.sdtExists(req.body.phoneNumber);
    if (sdtExists) {
      return next(new ApiError(400, "phoneNumber already exists"));
    }
    const document = await patientService.update(req.params.id, req.body);
    if (!document) {
      return next(new ApiError(404, "Patient not found"));
    }
    return res.send({ message: "Patient was updated successfully" });
  } catch (error) {
    return next(
      new ApiError(500, `Error updating patient with id=${req.params.id}`)
    );
  }
};

exports.delete = async (req, res, next) => {
  try {
    const patientService = new PatientService(MongoDB.client);
    const document = await patientService.delete(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Patient not found"));
    }
    return res.send({ message: "Patient was deleted successfully" });
  } catch (error) {
    return next(
      new ApiError(500, `Error deleting patient with id=${req.params.id}`)
    );
  }
};

exports.findAll = async (req, res, next) => {
  let documents = [];
  try {
    const patientService = new PatientService(MongoDB.client);
    documents = await patientService.find({});
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
    const patientService = new PatientService(MongoDB.client);
    const deletedCount = await patientService.deleteAll();
    return res.send({
      message: `${deletedCount} patients was deleted successfully`,
    });
  } catch (error) {
    return next(
      new ApiError(500, "An error occurred while removing all patients")
    );
  }
};

