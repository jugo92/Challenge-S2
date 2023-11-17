const { uuidv7 } = require("uuidv7");
const ValidationError = require("../errors/ValidationError");

class GenericService {
  constructor(model) {
    this.Model = model;
  }

  async getAll(query) {
    return this.Model.findAll({
      where: query,
    });
  }

  async getById(id) {
    return this.Model.findOne({
      where: {
        id,
      },
    });
  }

  async create(data) {
    try {
      const id = uuidv7();
      return this.Model.create({ id, ...data });
    } catch (error) {
      throw new Error("Erreur lors de la création");
    }
  }

  async update(id, data) {
    try {
      const nbDeleted = await this.Model.destroy({ where: { id } });
      const updatedItem = await this.Model.create({ id, ...data });

      if (nbDeleted > 0) {
        return { item: updatedItem, status: 200 };
      } else {
        return { item: updatedItem, status: 201 };
      }
    } catch (error) {
      throw new Error("Erreur lors de la mise à jour");
    }
  }

  async patch(id, body) {
    try {
      const [_, items] = await this.Model.update(body, {
        where: { id },
        individualHooks: true,
      });
      console.log(items);
      if (!items.length) {
        return { status: 404 };
      } else {
        return { item: items[0], status: 200 };
      }
    } catch (error) {
      console.log("ERROR : ", error);
      if (error.name === "SequelizeValidationError") {
        error = ValidationError.fromSequelize(error);
      }
      return error;
    }
  }

  async delete(id) {
    const nbDeleted = await this.Model.destroy({
      where: {
        id,
      },
    });
    return nbDeleted;
  }
}

module.exports = GenericService;
