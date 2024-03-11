const { ObjectId } = require("mongodb");

class DiseasesService {
  constructor(client) {
    this.Diseasess = client.db().collection("DSBenh");
  }

  extractDiseasesData(payload) {
    const Diseases = {
      code: payload.code,
      tenBenh: payload.tenBenh,
    };

    Object.keys(Diseases).forEach(
      (key) => Diseases[key] === undefined && delete Diseases[key]
    );

    return Diseases;
  }

  async codeExists(code) {
    const existingDiseases = await this.Diseasess.findOne({ code });
    return !!existingDiseases;
  }

  async create(payload) {
    const Diseases = this.extractDiseasesData(payload);
    const result = await this.Diseasess.insertOne(Diseases, {
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
    const cursor = await this.Diseasess.find(filter);
    return await cursor.toArray();
  }

  async findDiseasesById(id) {
    const Diseases = await this.Diseasess.findOne({ _id: new ObjectId(id) });
    return Diseases;
  }

  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
  };
    const update = this.extractDiseasesData(payload);
    const result = await this.Diseasess.findOneAndUpdate(
      filter, 
      { $set: update },
      { returnDocument: "after" }
    );
    return result;
  }

  async delete(id) {
    const result = await this.Diseasess.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result;
  }
  async deleteAll() {
    const result = await this.Diseasess.deleteMany({});
    return result.deletedCount;
  }
}

module.exports = DiseasesService;
