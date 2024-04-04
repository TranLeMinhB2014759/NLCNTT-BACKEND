const { ObjectId } = require("mongodb");
const ApiError = require("../api-error");
const RoomService = require("../services/room.service");
const MongoDB = require("../utils/mongodb.util");

exports.create = async (req, res, next) => {
  try {
    const roomService = new RoomService(MongoDB.client);

    const maPhongExists = await roomService.maPhongExists(req.body.maPhong);
    if (maPhongExists) {
      return next(new ApiError(400, "Ma phong already exists"));
    }

    const document = await roomService.create(req.body);
    return res.send(document);
  } catch (error) {
    console.log(error);
    return next(
      new ApiError(500, "An error occurred while creating a room")
    );
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const roomService = new RoomService(MongoDB.client);
    const document = await roomService.findById(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Room not found"));
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
    const roomService = new RoomService(MongoDB.client);

    const maPhongExists = await roomService.maPhongExists(req.body.maPhong);
    if (maPhongExists) {
      return next(new ApiError(400, "Ma Phong already exists"));
    }

    const document = await roomService.update(req.params.id, req.body);
    if (!document) {
      return next(new ApiError(404, "Room not found"));
    }
    return res.send({ message: "Room was updated successfully" });
  } catch (error) {
    return next(
      new ApiError(500, `Error updating room with id=${req.params.id}`)
    );
  }
};

exports.delete = async (req, res, next) => {
  try {
    const roomService = new RoomService(MongoDB.client);
    const document = await roomService.delete(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Room not found"));
    }
    return res.send({ message: "Room was deleted successfully" });
  } catch (error) {
    return next(
      new ApiError(500, `Error deleting room with id=${req.params.id}`)
    );
  }
};

exports.findAll = async (req, res, next) => {
  let documents = [];
  try {
    const roomService = new RoomService(MongoDB.client);
    documents = await roomService.find({});
  } catch (error) {
    console.log(error);
    return next(
      new ApiError(500, "An error occurred while retrieving rooms")
    );
  }
  return res.send(documents);
};

exports.deleteAll = async (req, res, next) => {
  try {
    const roomService = new RoomService(MongoDB.client);
    const deletedCount = await roomService.deleteAll();
    return res.send({
      message: `${deletedCount} rooms were deleted successfully`,
    });
  } catch (error) {
    return next(
      new ApiError(500, "An error occurred while removing all rooms")
    );
  }
};