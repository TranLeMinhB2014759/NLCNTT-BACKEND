const { ObjectId } = require("mongodb");

class AppointmentService {
  constructor(client) {
    this.Appointments = client.db().collection("DatLichHen");
  }

  extractAppointmentData(payload) {
    const appointment = {
      MSTN: payload.MSTN,
      name: payload.name,
      phoneNumber: payload.phoneNumber,
      gender: payload.gender,
      year: payload.year,
      address: payload.address,
      service: payload.service,
      type: payload.type,
      doctor: payload.doctor,
      room: payload.room,
      day: payload.day,
      time: payload.time,
      confirmer: payload.confirmer,
      confirm: payload.confirm,
      receive: payload.receive,
      lastUpdated: payload.lastUpdated,
    };

    Object.keys(appointment).forEach(
      (key) => appointment[key] === undefined && delete appointment[key]
    );

    return appointment;
  }

  async create(payload) {
    const appointment = this.extractAppointmentData(payload);
    const result = await this.Appointments.insertOne(appointment, {
      returnDocument: "after",
      upsert: true,
    });
    return result.value;
  }

  // async findByName(name) {
  //   return await this.find({
  //     name: { $regex: new RegExp(name), $options: "i" },
  //   });
  // }

  async find(filter) {
    const cursor = await this.Appointments.find(filter);
    return await cursor.toArray();
  }

  async findById(id) {
    return await this.Appointments.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  async delete(id) {
    const result = await this.Appointments.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result;
  }

  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
  };
    const update = this.extractAppointmentData(payload);
    const result = await this.Appointments.findOneAndUpdate(
      filter, 
      { $set: update },
      { returnDocument: "after" }
    );
    return result;
  }

  // async confirm(id, confirmer) {
  //   if (confirmer === null) {
  //     throw new Error("Confirmer is null");
  //   }

  //   const result = await this.Appointments.findOneAndUpdate(
  //     { _id: ObjectId.isValid(id) ? new ObjectId(id) : null },
  //     { $set: { confirm: "yes", confirmer: confirmer } },
  //     { returnOriginal: false }
  //   );
  //   return result.value;
  // }

  async cancel(id, confirmer) {
    if (confirmer === null) {
      throw new Error("Confirmer is null");
    }

    const result = await this.Appointments.findOneAndUpdate(
      { _id: ObjectId.isValid(id) ? new ObjectId(id) : null },
      { $set: { confirm: "cancel", confirmer: confirmer } },
      { returnOriginal: false }
    );
    return result.value;
  }

  async receive(id) {
    const result = await this.Appointments.findOneAndUpdate(
      { _id: ObjectId.isValid(id) ? new ObjectId(id) : null },
      { $set: { receive: "yes" } },
      { returnOriginal: false }
    );
    return result.value;
  }  

  async deleteAll() {
    const result = await this.Appointments.deleteMany({});
    return result.deletedCount;
  }
}

module.exports = AppointmentService;