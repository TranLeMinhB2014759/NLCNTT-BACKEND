const { ObjectId } = require("mongodb");

class DoctorService {
  constructor(client) {
    this.Doctors = client.db().collection("BacSi");
  }

  extractDoctorData(payload) {
    const doctor = {
      name: payload.name,
      hocVi: payload.hocVi,
      chuyenMon: payload.chuyenMon,
      thamNien: payload.thamNien,
      imgURL: payload.imgURL,
    };

    Object.keys(doctor).forEach(
      (key) => doctor[key] === undefined && delete doctor[key]
    );

    return doctor;
  }

  // async nameExists(name) {
  //   const existingDoctor = await this.Doctors.findOne({ name });
  //   return !!existingDoctor;
  // }

  async create(payload) {
    const doctor = this.extractDoctorData(payload);
    const result = await this.Doctors.insertOne(doctor, {
      returnDocument: "after",
      upsert: true,
    });
    return result.value;
  }

  async findByName(tenBenh) {
    return await this.find({
      tenBenh: { $regex: new RegExp(tenBenh), $options: "i" },
    });
  }

  async find(filter) {
    const cursor = await this.Doctors.find(filter);
    return await cursor.toArray();
  }

  async findDoctorById(id) {
    const Doctors = await this.Doctors.findOne({ _id: new ObjectId(id) });
    return Doctors;
  }

  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
  };
    const update = this.extractDoctorData(payload);
    const result = await this.Doctors.findOneAndUpdate(
      filter, 
      { $set: update },
      { returnDocument: "after" }
    );
    return result;
  }

  async delete(id) {
    const result = await this.Doctors.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result;
  }
  async deleteAll() {
    const result = await this.Doctors.deleteMany({});
    return result.deletedCount;
  }
}

module.exports = DoctorService;
