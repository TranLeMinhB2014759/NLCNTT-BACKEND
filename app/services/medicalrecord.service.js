const { ObjectId } = require("mongodb");

class MedicalrecordService {
  constructor(client) {
    this.Medicalrecords = client.db().collection("HoSoBenhAn");
  }

  extractMedicalrecordData(payload) {
    const medicine = {
        MSBN: payload.MSBN,
        MSDT: payload.MSDT,
        name: payload.name,    
        year: payload.year,
        gender: payload.gender,
        phoneNumber: payload.phoneNumber,
        address: payload.address,
        symptom: payload.symptom, // Triệu chứng
        diagnosis: payload.diagnosis, // Chuẩn đoán
        prescription: payload.prescription, //Toa thuốc
        GhiChu: payload.GhiChu,
        ngayKham: payload.ngayKham,
        bacsi: payload.bacsi,
    };

    Object.keys(medicine).forEach(
      (key) => medicine[key] === undefined && delete medicine[key]
    );

    return medicine;
  }

  async create(payload) {
    const medicine = this.extractMedicalrecordData(payload);
    const result = await this.Medicalrecords.insertOne(medicine, {
      returnDocument: "after",
      upsert: true,
    });
    return result.value;
  }

  async findByPhoneNumber(phoneNumber) {
    return await this.Medicalrecords.find({ phoneNumber }).toArray();
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
