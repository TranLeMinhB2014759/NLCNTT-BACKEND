const { ObjectId } = require("mongodb");
const ApiError = require("../api-error");
const StaffService = require("../services/staff.service");
const MongoDB = require("../utils/mongodb.util");

exports.create = async (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return next(new ApiError(400, "Name, email, and password are required fields"));
  }
  try {
    const staffService = new StaffService(MongoDB.client);

    const emailExists = await staffService.emailExists(email);
    if (emailExists) {
      return next(new ApiError(400, "Email already exists"));
    }

    const document = await staffService.create(req.body);
    return res.send(document);
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "An error occurred while creating a staff"));
  }
};

exports.findStaffById = async (req, res, next) => {
  try {
    const staffService = new StaffService(MongoDB.client);
    const document = await staffService.findStaffById(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Staff not found"));
    }
    return res.send(document);
  } catch (error) {
    console.log(error);
    return next(
      new ApiError(500, `Error retrieving staff with id=${req.params.id}`)
    );
  }
};

exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Data to update can't be empty"));
  }
  try {
    const staffService = new StaffService(MongoDB.client);
    const emailExists = await staffService.emailExists(req.body.email);
    if (emailExists) {
      return next(new ApiError(400, "Email already exists"));
    }
    const document = await staffService.update(req.params.id, req.body);
    if (!document) {
      return next(new ApiError(404, "Staff not found"));
    }
    return res.send({ message: "Staff was updated successfully" });
  } catch (error) {
    return next(
      new ApiError(500, `Error updating staff with id=${req.params.id}`)
    );
  }
};

exports.delete = async (req, res, next) => {
  try {
    const staffService = new StaffService(MongoDB.client);
    const document = await staffService.delete(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Staff not found"));
    }
    return res.send({ message: "Staff was deleted successfully" });
  } catch (error) {
    return next(
      new ApiError(500, `Error deleting staff with id=${req.params.id}`)
    );
  }
};

exports.findAll = async (req, res, next) => {
  let documents = [];
  try {
    const staffService = new StaffService(MongoDB.client);
    documents = await staffService.find({});
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
    const staffService = new StaffService(MongoDB.client);
    const deletedCount = await staffService.deleteAll();
    return res.send({
      message: `${deletedCount} staffs were deleted successfully`,
    });
  } catch (error) {
    return next(
      new ApiError(500, "An error occurred while removing all staffs")
    );
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required fields' });
  }

  try {
    const staffService = new StaffService(MongoDB.client);
    const  staff  = await staffService.login(email, password);
    

    if (staff) {
      res.status(200).json({ message: 'Đăng nhập thành công', staff :  staff  });
    } else {
      res.status(401).json({ message: 'Đăng nhập thất bại' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};

exports.logout = async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email là trường bắt buộc' });
  }

  try {
    const staffService = new StaffService(MongoDB.client);
    await staffService.logout(email);
    res.status(200).json({ message: 'Đăng xuất thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};



