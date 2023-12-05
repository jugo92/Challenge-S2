const { uuidv7 } = require("uuidv7");
const ValidationError = require("../errors/ValidationError");

class GenericService {
  constructor(model) {
    this.Model = model;
  }

  async getAll(req, res) {
    const { page: reqPage, limit: reqLimit, ...filters } = req.query;
    const page = parseInt(reqPage) || 1;
    const limit = parseInt(reqLimit) || 10;
    const offset = (page - 1) * limit;

    try {
      // Récupérer les modèles avec la pagination
      const models = await this.Model.findAll({
        where: filters,
        limit,
        offset,
      });

      const countTotal = await this.Model.count({ where: filters });
      return res.status(200).json({ models, countTotal });
    } catch (error) {
      console.error("Une erreur s'est produite :", error);
      return res.status(500).json({ error: "Erreur interne du serveur" });
    }
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
      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
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
      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
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
      if (!items.length) {
        return res.sendStatus(404);
      } else {
        return res.status(200).json(items[0]);
      }
    } catch (error) {
      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
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
      individualHooks: true,
    });
    if (nbDeleted) return res.sendStatus(204);
    return res.sendStatus(404);
  }
}

module.exports = GenericService;
