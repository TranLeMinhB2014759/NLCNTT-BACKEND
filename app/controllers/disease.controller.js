const { ObjectId } = require("mongodb");
const ApiError = require("../api-error");
const DiseaseService = require("../services/disease.service");
const MongoDB = require("../utils/mongodb.util");

exports.create = async (req, res, next) => {
  if (!req.body?.tenBenh || !req.body?.code ) {
    return next(new ApiError(400, "Code are required fields"));
  }
  try {
    const diseaseService = new DiseaseService(MongoDB.client);

    const codeExists = await diseaseService.codeExists(req.body.code);
    if (codeExists) {
      return next(new ApiError(400, "Code already exists"));
    }

    const document = await diseaseService.create(req.body);
    return res.send(document);
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "An error occurred while creating a disease"));
  }
};

exports.findDiseaseById = async (req, res, next) => {
  try {
    const diseaseService = new DiseaseService(MongoDB.client);
    const document = await diseaseService.findDiseaseById(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Disease not found"));
    }
    return res.send(document);
  } catch (error) {
    console.log(error);
    return next(
      new ApiError(500, `Error retrieving disease with id=${req.params.id}`)
    );
  }
};

exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Data to update can't be empty"));
  }
  try {
    const diseaseService = new DiseaseService(MongoDB.client);
    
    const codeExists = await diseaseService.codeExists(req.body.code);
    if (codeExists) {
      return next(new ApiError(400, "Code already exists"));
    }

    const document = await diseaseService.update(req.params.id, req.body);
    if (!document) {
      return next(new ApiError(404, "Disease not found"));
    }
    return res.send({ message: "Disease was updated successfully" });
  } catch (error) {
    return next(
      new ApiError(500, `Error updating disease with id=${req.params.id}`)
    );
  }
};

exports.delete = async (req, res, next) => {
  try {
    const diseaseService = new DiseaseService(MongoDB.client);
    const document = await diseaseService.delete(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Disease not found"));
    }
    return res.send({ message: "Disease was deleted successfully" });
  } catch (error) {
    return next(
      new ApiError(500, `Error deleting disease with id=${req.params.id}`)
    );
  }
};

exports.findAll = async (req, res, next) => {
  let documents = [];
  try {
    const diseaseService = new DiseaseService(MongoDB.client);
    const { name } = req.query;
    if (name) {
      documents = await diseaseService.findByName(name);
    } else {
      documents = await diseaseService.find({});
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
    const diseaseService = new DiseaseService(MongoDB.client);
    const deletedCount = await diseaseService.deleteAll();
    return res.send({
      message: `${deletedCount} diseases was deleted successfully`,
    });
  } catch (error) {
    return next(
      new ApiError(500, "An error occurred while removing all diseases")
    );
  }
};

