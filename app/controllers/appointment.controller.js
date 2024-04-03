const { ObjectId } = require("mongodb");
const ApiError = require("../api-error");
const AppointmentService = require("../services/appointment.service");
const MongoDB = require("../utils/mongodb.util");

exports.create = async (req, res, next) => {
  if (!req.body?.name) {
    return next(new ApiError(400, "Tên khách hàng là trường bắt buộc"));
  }

  try {
    const appointmentService = new AppointmentService(MongoDB.client);
    const document = await appointmentService.create(req.body);
    return res.send(document);
  } catch (error) {
    console.log(error);
    return next(
      new ApiError(500, "An error occurred while creating a appointment")
    );
  }
};
exports.findOne = async (req, res, next) => {
  try {
    const appointmentService = new AppointmentService(MongoDB.client);
    const document = await appointmentService.findById(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Appointment not found"));
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
    const appointmentService = new AppointmentService(MongoDB.client);
    const document = await appointmentService.delete(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Appointment not found"));
    }
    return res.send({ message: "appointment was deleted successfully" });
  } catch (error) {
    return next(
      new ApiError(500, `Error deleting appointment with id=${req.params.id}`)
    );
  }
};

exports.findAll = async (req, res, next) => {
  let documents = [];

  try {
    const appointmentService = new AppointmentService(MongoDB.client);
    const { TenHH } = req.query;

    if (TenHH) {
      documents = await appointmentService.findByTenHH(TenHH);
    } else {
      documents = await appointmentService.find({});
    }
  } catch (error) {
    console.log(error);
    return next(
      new ApiError(500, "An error occurred while retrieving appointments")
    );
  }

  return res.send(documents);
};

exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Data to update can't be empty"));
  }
  try {
    const appointmentService = new AppointmentService(MongoDB.client);
    
    const document = await appointmentService.update(req.params.id, req.body);
    if (!document) {
      return next(new ApiError(404, "Appointment not found"));
    }
    return res.send({ message: "Appointment was updated successfully" });
  } catch (error) {
    return next(
      new ApiError(500, `Error updating appointment with id=${req.params.id}`)
    );
  }
};

// exports.confirm = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const { confirmer } = req.body;
//     if (confirmer === null) {
//       throw new Error("Confirmer is null");
//     }
//     const appointmentService = new AppointmentService(MongoDB.client);
//     const appointment = await appointmentService.findById(id);

//     if (!appointment) {
//       return next(new ApiError(404, "Không tìm thấy cuộc hẹn"));
//     }

//     const confirmedAppointment = await appointmentService.confirm(id, confirmer);

//     return res.send(confirmedAppointment);
//   } catch (error) {
//     return next(
//       new ApiError(500, `Error confirming appointment with id=${req.params.id}`)
//     );
//   }
// };

exports.cancel = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { confirmer } = req.body;

    if (confirmer === null) {
      throw new Error("Confirmer is null");
    }

    const appointmentService = new AppointmentService(MongoDB.client);
    const appointment = await appointmentService.findById(id);

    if (!appointment) {
      return next(new ApiError(404, "Không tìm thấy cuộc hẹn"));
    }

    const canceledAppointment = await appointmentService.cancel(id, confirmer);

    return res.send(canceledAppointment);
  } catch (error) {
    return next(
      new ApiError(500, `Lỗi khi hủy cuộc hẹn với id=${req.params.id}`)
    );
  }
};
