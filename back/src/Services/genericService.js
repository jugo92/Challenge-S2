const { uuidv7 } = require("uuidv7");
const ValidationError = require("../errors/ValidationError");

class GenericService {
  constructor(model) {
    this.Model = model;
  }

  async getAll(req, res) {
    const models = await this.Model.findAll({
      where: req.query,
    });
    return res.status(200).json(models);
  }

  async getById(req, res) {
    const id = req.params.id;
    const model = await this.Model.findOne({
      where: {
        id,
      },
    });
    if (model) return res.status(200).json(model);
    return res.sendStatus(404);
  }

  async create(req, res, next) {
    try {
      const id = uuidv7();
      const model = await this.Model.create({ id, ...req.body });
      return res.status(201).json(model);
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        error = ValidationError.fromSequelize(error);
      }
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const id = req.params.id;
      const nbDeleted = await this.Model.destroy({ where: { id } });
      const updatedItem = await this.Model.create({ id, ...req.body });

      if (nbDeleted > 0) {
        return res.status(200).json(updatedItem);
      } else {
        return res.status(201).json(updatedItem);
      }
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        error = ValidationError.fromSequelize(error);
      }
      next(error);
    }
  }

  async patch(req, res, next) {
    try {
      const id = req.params.id;
      const [_, items] = await this.Model.update(req.body, {
        where: { id },
        individualHooks: true,
      });
      console.log(items);
      if (!items.length) {
        return res.sendStatus(404);
      } else {
        return res.status(200).json(items[0]);
      }
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        error = ValidationError.fromSequelize(error);
      }
      next(error);
    }
  }

  async delete(req, res) {
    const id = req.params.id;
    const nbDeleted = await this.Model.destroy({
      where: {
        id,
      },
    });
    if (nbDeleted) return res.sendStatus(204);
    return res.sendStatus(404);
  }
}

module.exports = GenericService;
