const { ObjectId } = require("mongodb");
const ApiError = require("../api-error");
const ServiceService = require("../services/service.service");
const MongoDB = require("../utils/mongodb.util");

exports.create = async (req, res, next) => {
  if (!req.body?.tenDichVu || !req.body?.code ) {
    return next(new ApiError(400, "Code are required fields"));
  }

  try {
    const serviceService = new ServiceService(MongoDB.client);

    const codeExists = await serviceService.codeExists(req.body.code);
    if (codeExists) {
      return next(new ApiError(400, "Code already exists"));
    }

    const document = await serviceService.create(req.body);
    return res.send(document);
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "An error occurred while creating a service"));
  }
};

exports.findServiceById = async (req, res, next) => {
  try {
    const serviceService = new ServiceService(MongoDB.client);
    const document = await serviceService.findServiceById(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Service not found"));
    }
    return res.send(document);
  } catch (error) {
    console.log(error);
    return next(
      new ApiError(500, `Error retrieving service with id=${req.params.id}`)
    );
  }
};

exports.update = async (req, res, next) => {
  try {
    const serviceService = new ServiceService(MongoDB.client);

    if (Object.keys(req.body).length === 0) {
      return next(new ApiError(400, "Data to update can't be empty"));
    }

    const { code } = req.body;
    if (code) {
      const codeExists = await serviceService.codeExists(code);
      if (codeExists) {
        return next(new ApiError(400, "Code already exists"));
      }
    }

    const document = await serviceService.update(req.params.id, req.body);
    if (!document) {
      return next(new ApiError(404, "Service not found"));
    }
    return res.send({ message: "Service was updated successfully" });
  } catch (error) {
    return next(
      new ApiError(500, `Error updating service with id=${req.params.id}`)
    );
  }
};

exports.delete = async (req, res, next) => {
  try {
    const serviceService = new ServiceService(MongoDB.client);
    const document = await serviceService.delete(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Service not found"));
    }
    return res.send({ message: "Service was deleted successfully" });
  } catch (error) {
    return next(
      new ApiError(500, `Error deleting service with id=${req.params.id}`)
    );
  }
};

exports.findAll = async (req, res, next) => {
  let documents = [];
  try {
    const serviceService = new ServiceService(MongoDB.client);
    documents = await serviceService.find({});
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
    const serviceService = new ServiceService(MongoDB.client);
    const deletedCount = await serviceService.deleteAll();
    return res.send({
      message: `${deletedCount} services were deleted successfully`,
    });
  } catch (error) {
    return next(
      new ApiError(500, "An error occurred while removing all services")
    );
  }
};