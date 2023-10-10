const dbCaract = require("./../dbCaract");


module.exports.getAllCaract = async (req, res) => {
    try {
        const caract = await dbCaract.findAll();
        res.send(caract);
    } catch (err) {
        res.status(500).send({
            error: "The caract could not be retrieved.",
        });
    }
}

module.exports.getCaractById = async (req, res) => {
    try {
        const caract = await dbCaract.findOne({
            where: { id: req.params.id },
        });
        res.send(caract);
    } catch (err) {
        res.status(500).send({
            error: "The caract could not be retrieved.",
        });
    }
}


module.exports.CreateCaract = async (req, res) => {
    try {
        const caract = await dbCaract.create(req.body);
        res.send(caract);
    } catch (err) {
        res.status(500).send({
            error: "The caract could not be created.",
        });
    }
}


module.exports.updateCaract = async (req, res) => {
    try {
        const caract = await dbCaract.update(req.body, {
            where: { id: req.params.id },
        });
        res.send(caract);
    } catch (err) {
        res.status(500).send({
            error: "The caract could not be updated.",
        });
    }
}

module.exports.deleteCaract = async (req, res) => {
    try {
        const caract = await dbCaract.destroy({
            where: { id: req.params.id },
        });
        res.send(caract);
    } catch (err) {
        res.status(500).send({
            error: "The caract could not be deleted.",
        });
    }
}