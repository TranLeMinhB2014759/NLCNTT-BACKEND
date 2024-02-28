const { ObjectId } = require("mongodb");

class MedicineService {
  constructor(client) {
    this.Medicines = client.db().collection("Thuoc");
  }

  extractMedicineData(payload) {
    const medicine = {
      tenThuoc: payload.tenThuoc,
      Gia: payload.Gia,
      MoTa: payload.MoTa,
      SoLuong: payload.SoLuong,
      GhiChu: payload.GhiChu,
      imgURL: payload.imgURL,
    };

    // Remove undefined fields
    Object.keys(medicine).forEach(
      (key) => medicine[key] === undefined && delete medicine[key]
    );

    return medicine;
  }

  async create(payload) {
    const medicine = this.extractMedicineData(payload);
    const result = await this.Medicines.insertOne(medicine, {
      returnDocument: "after",
      upsert: true,
    });
    return result.value;
  }

  async findByTenThuoc(TenThuoc) {
    return await this.find({
      TenThuoc: { $regex: new RegExp(TenThuoc), $options: "i" },
    });
  }

  async find(filter) {
    const cursor = await this.Medicines.find(filter);
    return await cursor.toArray();
  }

  async findById(id) {
    return await this.Medicines.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
  });
  }

  async update(id, payload) {
    const filter = {
        _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };
    const update = this.extractMedicineData(payload);
    const result = await this.Medicines.findOneAndUpdate(
        filter,
        { $set: update },
        { returnDocument: "after" }
    );
    return result;
}


  async delete(id) {
    const result = await this.Medicines.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result;
  }

  
}

module.exports = MedicineService;
