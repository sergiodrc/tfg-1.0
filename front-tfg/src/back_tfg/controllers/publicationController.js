const message = require('../models/message')
let publicationService = require('../service/publicationService')

async function createPublication(req,res) {
    var result = await publicationService.createPublicationBD(req)
    console.log('Result -> ', result)
    if(result.status === true) {
        res.send({status: true, message: "publication created"})
    } else {
        res.send({status:false, message: "Error creating the publication"})
    }
}

async function deletePublication(req, res) {
    var result = await publicationService.deletePublicationBD(req.body)
    if (result.status === true) {
        res.send({status: true, message: "Publicacion eliminada"})
    } else {
        res.send({status: false, message: "Error al borrar la publicacion"})
    }
}

async function updatePublication(req,res) {
    let result = await publicationService.updatePublicationBD(req)
    if (result.status === true) {
        res.send({status: true, message: "Publicacion actualizada"})
    } else {
        res.send({status: false, message: "Error al actualizar la publicacion"})
    }
}

async function getAllPublications(req, res) {
    try {
        let result = await publicationService.getAllPublicationsBD()
        if (result.status === true) {
            res.send({ status: true, message: "Sacando publicaciones..." });
        } else {
            res.send({ status: true, message: "Algo ha fallado!" });
        }
    } catch {
        res.send({ status: true, message: "Error al sacar todas las publicaciones!" });
    }
}

module.exports = { createPublication, deletePublication, updatePublication, getAllPublications }