const { ObjectId } = require("mongodb");

class RoomService {
  constructor(client) {
    this.Rooms = client.db().collection("Phong");
  }

  extractRoomData(payload) {
    const room = {
        floor: payload.floor,
        stt: payload.stt,
        maPhong: payload.maPhong,
        bacSiChinh: payload.bacSiChinh,
        // bacSiPhu: payload.bacSiPhu,
        dichVu: payload.dichVu,
    };

    // Remove undefined fields
    Object.keys(room).forEach(
      (key) => room[key] === undefined && delete room[key]
    );
    return room;
  }

  async maPhongExists(maPhong) {
    const existingRoom = await this.Rooms.findOne({ maPhong });
    return !!existingRoom;
  }

  async create(payload) {
    const room = this.extractRoomData(payload);
    const result = await this.Rooms.insertOne(room, {
      returnDocument: "after",
      upsert: true,
    });
    return result.value;
  }

  async find(filter) {
    const cursor = await this.Rooms.find(filter);
    return await cursor.toArray();
  }

  async findById(id) {
    return await this.Rooms.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
  });
  }

  async update(id, payload) {
    const filter = {
        _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };
    const update = this.extractRoomData(payload);
    const result = await this.Rooms.findOneAndUpdate(
        filter,
        { $set: update },
        { returnDocument: "after" }
    );
    return result;
  }

  async delete(id) {
    const result = await this.Rooms.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result;
  }

  async deleteAll() {
    const result = await this.Rooms.deleteMany({});
    return result.deletedCount;
  }
}

module.exports = RoomService;
