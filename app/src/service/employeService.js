const { RedisConeection } = require("../../database/redis");

class EmployeService {
  constructor() {
    this.redis = new RedisConeection();
  }

  async getEmploye(id) {
    if (!id) {
      return false;
    }
    return await this.redis.safeQuery(async () => {
      try {
        let employe_key = `employe:${id}`;
        let parent_key = `parent:${id}`;
        this.redis.selectEmployeDB();
        let employeData = await this.redis.client.hGetAll(employe_key);
        this.redis.selectParentDB();
        let parentData = await this.redis.client.hGetAll(parent_key);
        let response = {
          ...employeData
        };
        if (Object.keys(parentData).length > 0) {
            response.parent_data = parentData
        }
        return response;
      } catch (error) {
        return {};
      }
    });
  }
  async createEmploye(id , data , isParent = false) {
    let ekey = (isParent) ? `parent:${id}` : `employe:${id}`
        

  }
  updateEmploye(data, isNew = true) {
    if (data.length <= 0) {
      return false;
    }
    this.redis.safeQuery(async () => {
      try {
        let employe_id;
        if (data.id && data.id !== "") {
          employe_id = data.id;
        } else {
          employe_id = await this.redis.employeUniqueID();
        }
        let parent_id = data.parent || false;
        let employe_key = `employe:${employe_id}`;
        let employe_parent_key = `employe:${parent_id}`;
        let parent_key = `parent:${employe_id}`;

        this.redis.selectEmployeDB();
        let parent_check = await this.redis.client.hGetAll(employe_parent_key);
        if (!parent_check || Object.keys(parent_check).length <= 0) {
          throw "کاربر مسئول پیدا نشد!!";
        }

        let employe_check = await this.redis.client.hGetAll(employe_key);
        if (
          isNew === false &&
          (!employe_check || Object.keys(employe_check).length <= 0)
        ) {
          throw "کاربر یافت نشد!";
        }

        this.redis.selectEmployeDB();
        let new_employe = {
          id: employe_id,
          data: JSON.stringify(data),
        };
        await this.redis.client.hSet(employe_key, new_employe);

        this.redis.selectParentDB();
        let new_parent = {
          id: parent_id,
          parent: employe_id,
        };
        await this.redis.client.hSet(parent_key, new_parent);

        throw (
          ("کاربر ایجاد شد!",
          {
            parent: new_parent,
            employe: new_employe,
          })
        );
      } catch (error) {
        throw ("خطا در ایجاد کاربر!", error);
      }
    });
  }
  dropEmploye(id) {
    if (!id) {
      return false;
    }
    this.redis.safeQuery(async () => {
      try {
        let eid = id || false;
        let employe_key = `employe:${eid}`;
        let parent_key = `parent:${eid}`;

        this.redis.selectEmployeDB();
        let employeData = await this.redis.client.del(employe_key);
        this.redis.selectParentDB();
        let parentData = await this.redis.client.del(parent_key);

        if (parentData && employeData) {
          return true;
        } else {
          return false;
        }
      } catch (error) {
        return false;
      }
    });
  }
}

module.exports = { EmployeService };
