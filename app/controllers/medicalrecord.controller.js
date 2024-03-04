const { ObjectId } = require("mongodb");
const ApiError = require("../api-error");
const MedicalrecordService = require("../services/medicalrecord.service");
const MongoDB = require("../utils/mongodb.util");

exports.create = async (req, res, next) => {
  if (!req.body?.phoneNumber) {
    return next(new ApiError(400, "Số điện thoại là trường bắt buộc"));
  }

  try {
    const medicalrecordService = new MedicalrecordService(MongoDB.client);
    const document = await medicalrecordService.create(req.body);
    return res.send(document);
  } catch (error) {
    console.log(error);
    return next(
      new ApiError(500, "An error occurred while creating a medicalrecord")
    );
  }
};
exports.findOne = async (req, res, next) => {
  try {
    const medicalrecordService = new MedicalrecordService(MongoDB.client);
    const document = await medicalrecordService.findById(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Medicalrecord not found"));
    }
    return res.send(document);
  } catch (error) {
    console.log(error);
    return next(
      new ApiError(500, `Error retrieving contact with id=${req.params.id} `)
    );
  }
};

exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Data to update can't be empty"));
  }

  try {
    const medicalrecordService = new MedicalrecordService(MongoDB.client);
    const document = await medicalrecordService.update(req.params.id, req.body);
    if (!document) {
      return next(new ApiError(404, "Medicalrecord not found"));
    }
    return res.send({ message: "Medicalrecord was updated successfully" });
  } catch (error) {
    return next(
      new ApiError(500, `Error updating medicalrecord with id=${req.params.id}`)
    );
  }
};

exports.delete = async (req, res, next) => {
  try {
    const medicalrecordService = new MedicalrecordService(MongoDB.client);
    const document = await medicalrecordService.delete(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Medicalrecord not found"));
    }
    return res.send({ message: "Medicalrecord was deleted successfully" });
  } catch (error) {
    return next(
      new ApiError(500, `Error deleting medicalrecord with id=${req.params.id}`)
    );
  }
};

exports.findAll = async (req, res, next) => {
  let documents = [];
  try {
    const medicalrecordService = new MedicalrecordService(MongoDB.client);
    const { TenHH } = req.query;

    if (TenHH) {
      documents = await medicalrecordService.findByTenHH(TenHH);
    } else {
      documents = await medicalrecordService.find({});
    }
  } catch (error) {
    console.log(error);
    return next(
      new ApiError(500, "An error occurred while retrieving medicalrecords")
    );
  }
  return res.send(documents);
};

exports.findByPhoneNumber = async (req, res, next) => {
  try {
      const medicalrecordService = new MedicalrecordService(MongoDB.client);
      const medicalrecords = await medicalrecordService.findByPhoneNumber(req.params.phoneNumber);
      if (medicalrecords.length === 0) {
          return res.status(404).json({ message: "No medical records found for the provided phone number" });
      }
      res.json(medicalrecords);
  } catch (error) {
      console.log(error);
      next(new ApiError(500, "Error finding medical records by phone number"));
  }
};


