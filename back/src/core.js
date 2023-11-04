// Verifie que les attributs envoyés dans la requête correspondent exactement à ceux de la table
module.exports.verifyRequestAttributes = (table, req) => {
  var keysFromTable;
  if (table.sequelize) {
    keysFromTable = Object.keys(table.rawAttributes).filter(
      key => key !== "id" && key !== "createdAt" && key !== "updatedAt"
    );
  } else {
    keysFromTable = Object.keys(table.schema.obj).filter(
      key => key !== "_id" && key !== "__v"
    );
  }
  const keysFromBody = Object.keys(req.body);
  return keysFromBody.every(key => keysFromTable.includes(key));
};

// Prototypes
Object.defineProperty(String.prototype, "capitalize", {
  value: function () {
    return this.split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  },
  enumerable: false,
});

const routePrefix = "/api";

const mongoose = require("mongoose");
module.exports.generateCrud = (
  model,
  modelName,
  router,
  hasPropertyVisible,
  hasVersionnings
) => {
  router.get(routePrefix + "/" + modelName, async (req, res) => {
    try {
      if (hasPropertyVisible) {
        const entities = await model.findAll({
          where: {
            visible: true,
          },
        });
        res.status(200).json(entities);
      } else {
        const entities = await model.findAll();
        res.status(200).json(entities);
      }
    } catch (err) {
      console.error(`Erreur lors de la récupération des ${modelName} : ${err}`);
      res
        .status(500)
        .json({ message: `Erreur lors de la récupération des ${modelName}` });
    }
  });

  router.get(routePrefix + "/" + modelName + "/:id", async (req, res) => {
    try {
      const modelId = req.params.id;
      const entity = await model.findByPk(modelId);
      res.status(200).json(entity);
    } catch (err) {
      console.error(`Erreur lors de la récupération de ${modelName} : ${err}`);
      res
        .status(500)
        .json({ message: `Erreur lors de la récupération de ${modelName}` });
    }
  });

  router.post(routePrefix + "/" + modelName, async (req, res) => {
    try {
      if (hasVersionnings) {
        const newEntity = await model.create({
          ...req.body,
          numeroVersion: 1,
        });
        await mongoose.models[modelName].create({
          id: newEntity.dataValues.id.toString(),
          version: 1,
          ...req.body,
        });
        res.status(201).json(newEntity);
      } else {
        const newEntity = await model.create(req.body);
        res.status(201).json(newEntity);
      }
    } catch (err) {
      console.error(`Erreur lors de la création de ${modelName} : ${err}`);
      res
        .status(500)
        .json({ message: `Erreur lors de la création de ${modelName}` });
    }
  });

  router.put(routePrefix + "/" + modelName + "/:id", async (req, res) => {
    try {
      const modelId = req.params.id;
      const entityToUpdate = await model.findByPk(modelId);

      if (!entityToUpdate) {
        res.status(404).json({ message: `Entité ${modelName} non trouvée` });
        return;
      }

      if (hasVersionnings) {
        const mongoModel = await mongoose.models[modelName]
          .findOne({
            id: modelId,
          })
          .sort({ version: -1 })
          .exec();
        console.log(mongoModel);
        const { _id, ...modeleExistant } = mongoModel._doc;
        await mongoose.models[modelName].create({
          ...modeleExistant,
          ...req.body,
          version: mongoModel.version + 1,
        });

        await entityToUpdate.update({
          ...req.body,
          numeroVersion: parseInt(entityToUpdate.numeroVersion) + 1,
        });
        res.status(200).json(entityToUpdate);
      } else {
        await entityToUpdate.update(req.body);
        res.status(200).json(entityToUpdate);
      }
    } catch (err) {
      console.error(`Erreur lors de la mise à jour de ${modelName} : ${err}`);
      res
        .status(500)
        .json({ message: `Erreur lors de la mise à jour de ${modelName}` });
    }
  });

  router.delete(routePrefix + "/" + modelName + "/:id", async (req, res) => {
    try {
      const modelId = req.params.id;
      const entityToDelete = await model.findByPk(modelId);

      if (!entityToDelete) {
        res.status(404).json({ message: `Entité ${modelName} non trouvée` });
        return;
      }
      if (hasPropertyVisible) {
        await entityToDelete.update(
          { visible: false },
          {
            where: {
              id: modelId,
            },
          }
        );
        res.status(200).send();
      } else {
        await entityToDelete.destroy();
        res.status(204).send();
      }
    } catch (err) {
      console.error(`Erreur lors de la suppression de ${modelName} : ${err}`);
      res
        .status(500)
        .json({ message: `Erreur lors de la suppression de ${modelName}` });
    }
  });
};
