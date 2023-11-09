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
      return this.Model.create({ ...data });
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
  async delete(id) {
    const [nbDeleted] = await this.Model.destroy({
      where: {
        id,
      },
    });
    return nbDeleted;
  }
}

module.exports = GenericService;
