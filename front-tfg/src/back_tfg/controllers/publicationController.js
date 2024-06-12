const message = require('../models/message')
let publicationService = require('../service/publicationService')

async function createPublication(req,res) {
    console.log(req)
    var result = await publicationService.createPublicationBD(req)
    console.log('Result -> ', result)
    if(result.status === true) {
        res.send({status: true, message: "publication created"})
    } else {
        res.send({status:false, message: "Error creating the publication"})
    }
}

async function deletePublication(req, res) {
    var result = await publicationService.deletePublicationBD(req.params)
    console.log(result)
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
            res.send({ status: true, publications: result.publications });
        } else {
            res.send({ status: true, message: "Algo ha fallado!" });
        }
    } catch(error) {
        console.log(error)
        res.send({ status: false, message: "Error al sacar todas las publicaciones!" });
    }
}

async function getMyPublications(req, res) {
    try {
        console.log('aaaa',req)
        let result = await publicationService.getMyPublicationsBD(req.params)
        if (result.status === true) {
            res.send({ status: true, publications: result.publications });
        } else {
            res.send({ status: true, message: "Algo ha fallado!" });
        }
    } catch(error) {
        console.log(error)
        res.send({ status: false, message: "Error al sacar todas las publicaciones!" });
    }
}

module.exports = { createPublication, deletePublication, updatePublication, getAllPublications, getMyPublications }