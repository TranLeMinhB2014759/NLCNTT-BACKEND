const { ObjectId } = require("mongodb");

class DiseaseService {
  constructor(client) {
    this.Diseases = client.db().collection("DSBenh");
  }

  extractDiseaseData(payload) {
    const disease = {
      code: payload.code,
      tenBenh: payload.tenBenh,
    };

    Object.keys(disease).forEach(
      (key) => disease[key] === undefined && delete disease[key]
    );

    return disease;
  }

  async codeExists(code) {
    const existingDisease = await this.Diseases.findOne({ code });
    return !!existingDisease;
  }

  async create(payload) {
    const disease = this.extractDiseaseData(payload);
    const result = await this.Diseases.insertOne(disease, {
      returnDocument: "after",
      upsert: true,
    });
    return result.value;
  }

  // async findByName(tenBenh) {
  //   return await this.find({
  //     tenBenh: { $regex: new RegExp(tenBenh), $options: "i" },
  //   });
  // }

  async find(filter) {
    const cursor = await this.Diseases.find(filter);
    return await cursor.toArray();
  }

  async findDiseaseById(id) {
    const Diseases = await this.Diseases.findOne({ _id: new ObjectId(id) });
    return Diseases;
  }

  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
  };
    const update = this.extractDiseaseData(payload);
    const result = await this.Diseases.findOneAndUpdate(
      filter, 
      { $set: update },
      { returnDocument: "after" }
    );
    return result;
  }

  async delete(id) {
    const result = await this.Diseases.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result;
  }
  
  async deleteAll() {
    const result = await this.Diseases.deleteMany({});
    return result.deletedCount;
  }
}

module.exports = DiseaseService;
