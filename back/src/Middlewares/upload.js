const multer = require("multer");
const mime = require("mime-types");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Le dossier où les fichiers seront enregistrés
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Nom du fichier
    },
});

const upload = multer({ storage: storage });

// Middleware Multer
const multerMiddleware = (req, res, next) => {
    upload.single('file')(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).send(err.message);
        } else if (err) {
            return res.status(500).send('Erreur interne du serveur');
        }

        // Vérifier le type MIME du fichier
        const allowedMimeTypes = ['image/jpeg', 'image/png'];
        const fileMimeType = mime.lookup(req.file.originalname);

        if (!allowedMimeTypes.includes(fileMimeType)) {
            // Type MIME non autorisé, supprimer le fichier téléchargé
            fs.unlinkSync(req.file.path);
            return res.status(400).send('Le fichier doit être une image JPEG ou PNG');
        }

        console.log('Données du formulaire :', req.body);
        console.log('Fichier téléchargé :', req.file);
        next();
    });
};

module.exports = multerMiddleware;
