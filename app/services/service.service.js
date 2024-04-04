const { ObjectId } = require("mongodb");

class ServiceService {
  constructor(client) {
    this.Services = client.db().collection("DichVu");
  }

  extractServiceData(payload) {
    const service = {
      code: payload.code,
      tenDichVu: payload.tenDichVu,
      Gia: payload.Gia,
      status: payload.status,
    };

    Object.keys(service).forEach(
      (key) => service[key] === undefined && delete service[key]
    );

    return service;
  }

  async codeExists(code) {
    const existingService = await this.Services.findOne({ code });
    return !!existingService;
  }

  async create(payload) {
    const service = this.extractServiceData(payload);
    const result = await this.Services.insertOne(service, {
      returnDocument: "after",
      upsert: true,
    });
    return result.value;
  }

  async findByName(tenDichVu) {
    return await this.find({
      tenDichVu: { $regex: new RegExp(tenDichVu), $options: "i" },
    });
  }

  async find(filter) {
    const cursor = await this.Services.find(filter);
    return await cursor.toArray();
  }

  async findServiceById(id) {
    const service = await this.Services.findOne({ _id: new ObjectId(id) });
    return service;
  }

  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };
    const update = this.extractServiceData(payload);
    const result = await this.Services.findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: "after" }
    );
    return result;
  }

  async delete(id) {
    const result = await this.Services.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result;
  }

  async deleteAll() {
    const result = await this.Services.deleteMany({});
    return result.deletedCount;
  }
}

module.exports = ServiceService;
