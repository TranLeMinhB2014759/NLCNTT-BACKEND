const { ObjectId } = require("mongodb");
const ApiError = require("../api-error");
const DiseasesService = require("../services/diseases.service");
const MongoDB = require("../utils/mongodb.util");

exports.create = async (req, res, next) => {
  if (!req.body?.tenBenh || !req.body?.code ) {
    return next(new ApiError(400, "Code are required fields"));
  }
  try {
    const diseasesService = new DiseasesService(MongoDB.client);

    const codeExists = await diseasesService.codeExists(req.body.code);
    if (codeExists) {
      return next(new ApiError(400, "Code already exists"));
    }

    const document = await diseasesService.create(req.body);
    return res.send(document);
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "An error occurred while creating a diseases"));
  }
};

exports.findDiseasesById = async (req, res, next) => {
  try {
    const diseasesService = new DiseasesService(MongoDB.client);
    const document = await diseasesService.findDiseasesById(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Diseases not found"));
    }
    return res.send(document);
  } catch (error) {
    console.log(error);
    return next(
      new ApiError(500, `Error retrieving diseases with id=${req.params.id}`)
    );
  }
};

exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Data to update can't be empty"));
  }
  try {
    const diseasesService = new DiseasesService(MongoDB.client);
    const document = await diseasesService.update(req.params.id, req.body);
    if (!document) {
      return next(new ApiError(404, "Diseases not found"));
    }
    return res.send({ message: "Diseases was updated successfully" });
  } catch (error) {
    return next(
      new ApiError(500, `Error updating diseases with id=${req.params.id}`)
    );
  }
};

exports.delete = async (req, res, next) => {
  try {
    const diseasesService = new DiseasesService(MongoDB.client);
    const document = await diseasesService.delete(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Diseases not found"));
    }
    return res.send({ message: "Diseases was deleted successfully" });
  } catch (error) {
    return next(
      new ApiError(500, `Error deleting diseases with id=${req.params.id}`)
    );
  }
};

exports.findAll = async (req, res, next) => {
  let documents = [];
  try {
    const diseasesService = new DiseasesService(MongoDB.client);
    const { name } = req.query;
    if (name) {
      documents = await diseasesService.findByName(name);
    } else {
      documents = await diseasesService.find({});
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
    const diseasesService = new DiseasesService(MongoDB.client);
    const deletedCount = await diseasesService.deleteAll();
    return res.send({
      message: `${deletedCount} diseasess was deleted successfully`,
    });
  } catch (error) {
    return next(
      new ApiError(500, "An error occurred while removing all diseasess")
    );
  }
};

