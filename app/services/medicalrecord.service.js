const { ObjectId } = require("mongodb");

class MedicalrecordService {
  constructor(client) {
    this.Medicalrecords = client.db().collection("HoSoBenhAn");
  }

  extractMedicalrecordData(payload) {
    const medicalrecord = {
      MSBN: payload.MSBN,
      MSHS: payload.MSHS,
      name: payload.name,
      year: payload.year,
      gender: payload.gender,
      phoneNumber: payload.phoneNumber,
      address: payload.address,
      symptom: payload.symptom,
      diagnosis: payload.diagnosis,
      service: payload.service,
      prescription: payload.prescription,
      GhiChu: payload.GhiChu,
      ngayKham: payload.ngayKham,
      bacsi: payload.bacsi,
      status: payload.status,
    };

    Object.keys(medicalrecord).forEach(
      (key) => medicalrecord[key] === undefined && delete medicalrecord[key]
    );

    return medicalrecord;
  }

  async create(payload) {
    const medicalrecord = this.extractMedicalrecordData(payload);
    const result = await this.Medicalrecords.insertOne(medicalrecord, {
      returnDocument: "after",
      upsert: true,
    });
    return result.value;
  }

  async findByPhoneNumber(phoneNumber) {
    return await this.Medicalrecords.find({ phoneNumber }).toArray();
  }

  async findByMSHS(MSHS) {
    return await this.Medicalrecords.find({ MSHS }).toArray();
  }

  async find(filter) {
    const cursor = await this.Medicalrecords.find(filter);
    return await cursor.toArray();
  }

  async findById(id) {
    return await this.Medicalrecords.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };
    const update = this.extractMedicalrecordData(payload);
    const result = await this.Medicalrecords.findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: "after" }
    );
    return result;
  }

  async delete(id) {
    const result = await this.Medicalrecords.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result;
  }
}

module.exports = MedicalrecordService;
