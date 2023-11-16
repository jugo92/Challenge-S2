class GenericController {
  constructor(service) {
    this.service = service;
  }

  async getAll(req, res) {
    try {
      console.log("JE SAIS PLUS  ", this.service.getAll);
      const items = await this.service.getAll(req.query);
      res.json(items);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Erreur lors de la récupération des données" });
    }
  }

  async getById(req, res) {
    try {
      const id = req.params.id;
      const item = await this.service.getById(id);
      if (item) {
        res.json(item);
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      res
        .status(500)
        .json({ error: "Erreur lors de la récupération de l'élément" });
    }
  }

  async create(req, res) {
    try {
      console.log("ICI");
      const newItem = await this.service.create(req.body);
      res.status(201).json(newItem);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "Erreur lors de la création de l'élément" });
    }
  }

  async update(req, res) {
    try {
      const id = req.params.id;
      const { item, status } = await this.service.update(id, req.body);

      if (item) {
        res.status(status).json(item);
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la mise à jour" });
    }
  }

  async delete(req, res) {
    try {
      const id = req.params.id;
      const deleteCount = await this.service.delete(id);
      if (deleteCount) {
        res.sendStatus(204);
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      res
        .status(500)
        .json({ error: "Erreur lors de la suppression de l'élément" });
    }
  }
}

module.exports = GenericController;
