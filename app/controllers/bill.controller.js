const { ObjectId } = require("mongodb");
const ApiError = require("../api-error");
const BillService = require("../services/bill.service");
const MongoDB = require("../utils/mongodb.util");

exports.create = async (req, res, next) => {
  if (!req.body?.name) {
    return next(new ApiError(400, "Tên khách hàng là trường bắt buộc"));
  }

  try {
    const billService = new BillService(MongoDB.client);
    const document = await billService.create(req.body);
    return res.send(document);
  } catch (error) {
    console.log(error);
    return next(
      new ApiError(500, "An error occurred while creating a bill")
    );
  }
};
exports.findOne = async (req, res, next) => {
  try {
    const billService = new BillService(MongoDB.client);
    const document = await billService.findById(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Bill not found"));
    }
    return res.send(document);
  } catch (error) {
    console.log(error);
    return next(
      new ApiError(500, `Error retrieving contact with id=${req.params.id} `)
    );
  }
};

exports.delete = async (req, res, next) => {
  try {
    const billService = new BillService(MongoDB.client);
    const document = await billService.delete(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Bill not found"));
    }
    return res.send({ message: "Bill was deleted successfully" });
  } catch (error) {
    return next(
      new ApiError(500, `Error deleting bill with id=${req.params.id}`)
    );
  }
};

exports.findAll = async (req, res, next) => {
  let documents = [];

  try {
    const billService = new BillService(MongoDB.client);
    const { TenHH } = req.query;

    if (TenHH) {
      documents = await billService.findByTenHH(TenHH);
    } else {
      documents = await billService.find({});
    }
  } catch (error) {
    console.log(error);
    return next(
      new ApiError(500, "An error occurred while retrieving bills")
    );
  }

  return res.send(documents);
};


