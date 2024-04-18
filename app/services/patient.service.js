const { ObjectId } = require("mongodb");

class PatientService {
  constructor(client) {
    this.Patients = client.db().collection("BenhNhan");
  }

  extractPatientData(payload) {
    const patient = {
      MSBN: payload.MSBN,
      name: payload.name,    
      year: payload.year,
      gender: payload.gender,
      phoneNumber: payload.phoneNumber,
      address: payload.address,
    };

    Object.keys(patient).forEach(
      (key) => patient[key] === undefined && delete patient[key]
    );

    return patient;
  }

  async sdtExists(phoneNumber) {
    const existingPatient = await this.Patients.findOne({ phoneNumber });
    return !!existingPatient;
  }

  async create(payload) {
    const patient = this.extractPatientData(payload);
    const result = await this.Patients.insertOne(patient, {
      returnDocument: "after",
      upsert: true,
    });
    return result.value;
  }

  async findByName(name) {
    return await this.find({
      name: { $regex: new RegExp(name), $options: "i" },
    });
  }

  async listPhoneNumber() {
    const patients = await this.find({});
    const phoneNumbersAndIDs = patients.map(patient => {
        return { _id: patient._id, phoneNumber: patient.phoneNumber };
    });
    return phoneNumbersAndIDs;
}

  async findPatientByPhoneNumber(phoneNumber) {
    return await this.Patients.find({ phoneNumber }).toArray();
  }

  // async findPatientIDByPhoneNumber(phoneNumber) {
  //   const patient = await this.Patients.findOne({ phoneNumber }, { projection: { _id: 1 } });
  //   return patient ? patient._id : null;
  // }

  async find(filter) {
    const cursor = await this.Patients.find(filter);
    return await cursor.toArray();
  }

  async findPatientById(id) {
    const patient = await this.Patients.findOne({ _id: new ObjectId(id) });
    return patient;
  }

  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
  };
    const update = this.extractPatientData(payload);
    const result = await this.Patients.findOneAndUpdate(
      filter, 
      { $set: update },
      { returnDocument: "after" }
    );
    return result;
  }

  async delete(id) {
    const result = await this.Patients.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result;
  }
  
  async deleteAll() {
    const result = await this.Patients.deleteMany({});
    return result.deletedCount;
  }
}

module.exports = PatientService;
