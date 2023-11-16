const mongoose = require("mongoose");

const statistiqueSchema = new mongoose.Schema(
    {
        month: {
            type: Number,
            required: true,
            minimum: 2,
            maximum: 12
        },
        year: {
            type: Number,
            required: true,
            minimum: 2020,
            maximum: new Date().getFullYear()+1
        },
        nbUser: {
            type: Number,
            required: true,
            minimum: 0
        },
        nbNewUsers: {
            type: Number,
            required: true,
            minimum: 0
        },
        nbCommand: {
            type: Number,
            required: true,
            minimum: 0
        },
        nbSalesProduct: {
            type: Number,
            required: true,
            minimum: 0
        },
        mostSoldProduct: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true,
    }
);

const StatistiqueModel = mongoose.model("statistiques", statistiqueSchema);
module.exports = StatistiqueModel;

// const stats = [
//     {
//         month: 1,
//         year: 2021,
//         nbUser: 100,
//         nbNewUsers: 20,
//         nbCommand: 50,
//         nbSalesProduct: 200,
//         mostSoldProduct: 'Product A'
//     },
//     {
//         month: 2,
//         year: 2021,
//         nbUser: 120,
//         nbNewUsers: 30,
//         nbCommand: 60,
//         nbSalesProduct: 250,
//         mostSoldProduct: 'Product B'
//     }
// ];
//
// // Insertion des objets statistiques dans la collection
// StatistiqueModel.insertMany(stats)
//     .then(function (docs) {
//         console.log(docs);
//     })
//     .catch(function (err) {
//         console.log(err);
//     });