const { ObjectId } = require("mongodb");

class BillService {
  constructor(client) {
    this.Bills = client.db().collection("HoaDon");
  }

  extractBillData(payload) {
    const bill = {
        MSHS: payload.MSHS,
        ngayLap: payload.ngayLap,
        name: payload.name,
        phoneNumber: payload.phoneNumber,
        service: payload.service,
        total_service: payload.total_service,
        prescription: payload.prescription,
        total_prescription: payload.total_prescription,
        total_bill: payload.total_bill,
        nguoiLap: payload.nguoiLap,
    };

    Object.keys(bill).forEach(
      (key) => bill[key] === undefined && delete bill[key]
    );

    return bill;
  }

  async create(payload) {
    const bill = this.extractBillData(payload);
    const result = await this.Bills.insertOne(bill, {
      returnDocument: "after",
      upsert: true,
    });
    return result.value;
  }

  async find(filter) {
    const cursor = await this.Bills.find(filter);
    return await cursor.toArray();
  }

  async findById(id) {
    return await this.Bills.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  async delete(id) {
    const result = await this.Bills.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result;
  }

  async deleteAll() {
    const result = await this.Bills.deleteMany({});
    return result.deletedCount;
  }
}

module.exports = BillService;
