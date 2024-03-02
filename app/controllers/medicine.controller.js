const { ObjectId } = require("mongodb");
const ApiError = require("../api-error");
const MedicineService = require("../services/medicine.service");
const MongoDB = require("../utils/mongodb.util");

exports.create = async (req, res, next) => {
  if (!req.body?.tenThuoc) {
    return next(new ApiError(400, "Tên thuốc là trường bắt buộc"));
  }

  try {
    const medicineService = new MedicineService(MongoDB.client);
    const document = await medicineService.create(req.body);
    return res.send(document);
  } catch (error) {
    console.log(error);
    return next(
      new ApiError(500, "An error occurred while creating a medicine")
    );
  }
};
exports.findOne = async (req, res, next) => {
  try {
    const medicineService = new MedicineService(MongoDB.client);
    const document = await medicineService.findById(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Medicine not found"));
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
    const medicineService = new MedicineService(MongoDB.client);
    const document = await medicineService.update(req.params.id, req.body);
    if (!document) {
      return next(new ApiError(404, "Medicine not found"));
    }
    return res.send({ message: "Medicine was updated successfully" });
  } catch (error) {
    return next(
      new ApiError(500, `Error updating medicine with id=${req.params.id}`)
    );
  }
};

exports.delete = async (req, res, next) => {
  try {
    const medicineService = new MedicineService(MongoDB.client);
    const document = await medicineService.delete(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Medicine not found"));
    }
    return res.send({ message: "Medicine was deleted successfully" });
  } catch (error) {
    return next(
      new ApiError(500, `Error deleting medicine with id=${req.params.id}`)
    );
  }
};

exports.findAll = async (req, res, next) => {
  let documents = [];

  try {
    const medicineService = new MedicineService(MongoDB.client);
    const { TenHH } = req.query;

    if (TenHH) {
      documents = await medicineService.findByTenHH(TenHH);
    } else {
      documents = await medicineService.find({});
    }
  } catch (error) {
    console.log(error);
    return next(
      new ApiError(500, "An error occurred while retrieving medicines")
    );
  }

  return res.send(documents);
};


