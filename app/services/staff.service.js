const { ObjectId } = require("mongodb");

class StaffService {
  constructor(client) {
    this.Staffs = client.db().collection("NhanVien");
  }

  extractStaffData(payload) {
    // Trong extractStaffData method
    const staff = {
      name: payload.name,
      email: payload.email,
      password: payload.password,
      address: payload.address,
      phoneNumber: payload.phoneNumber,
      role: payload.role,
      imgURL: payload.imgURL,
      token: payload.token || null, // Thêm trường token
    };

    //Loại bỏ trường underfine
    Object.keys(staff).forEach(
      (key) => staff[key] === undefined && delete staff[key]
    );

    return staff;
  }

  async emailExists(email) {
    const existingStaff = await this.Staffs.findOne({ email });
    return !!existingStaff;
  }

  async create(payload) {
    const staff = this.extractStaffData(payload);
    const result = await this.Staffs.findOneAndUpdate(
      { email: staff.email },
      {
        $set: {
          name: staff.name,
          email: staff.email,
          password: staff.password,
          address: staff.address,
          phoneNumber: staff.phoneNumber,
          role: staff.role,
          imgURL: staff.imgURL,
        },
      },
      { returnDocument: "after", upsert: true }
    );
    return result.value;
  }

  async findByName(name) {
    return await this.find({
      name: { $regex: new RegExp(name), $options: "i" },
    });
  }

  async find(filter) {
    const cursor = await this.Staffs.find(filter);
    return await cursor.toArray();
  }

  async findStaffById(id) {
    const staff = await this.Staffs.findOne({ _id: new ObjectId(id) });
    return staff;
  }

  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
  };
    const update = this.extractStaffData(payload);
    const result = await this.Staffs.findOneAndUpdate(
      filter, 
      { $set: update },
      { returnDocument: "after" }
    );
    return result;
  }

  async delete(id) {
    const result = await this.Staffs.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result;
  }
  async deleteAll() {
    const result = await this.Staffs.deleteMany({});
    return result.deletedCount;
  }

  async login(email, password) {
    let staff  =  null;
      staff = await this.Staffs.findOne({ email });

    if (staff && staff.password === password) {
  
      return staff;
    } else {
      return null;
    }
  }
  
  async logout(email) {
    await this.Staffs.updateOne({ email }, { $set: { token: null } });
  }

  async changePassword(email, current_password, new_password) {
    try {
        let staff = null;
        staff = await this.Staffs.findOne({ email });

        if (staff && staff.password === current_password) {
            const result = await this.Staffs.updateOne(
                { email },
                { $set: { password: new_password } }
            );
            if (result.modifiedCount === 1) {
                return staff;
            } else {
                throw new Error('Failed to update password');
            }
        } else {
            return null;
        }
    } catch (error) {
        throw error;
    }
}

}

module.exports = StaffService;