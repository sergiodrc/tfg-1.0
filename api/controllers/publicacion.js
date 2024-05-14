'use strict'

var fs = require('fs');
var path = require('path');
var moment = require('moment');
var mongoosePaginate = require('mongoose-pagination');
var Publicacion = require('../models/publicacion');
var User = require('../models/user');
var Follow = require('../models/follow');


//Crear Publicacion
function savePublicacion(res, req) {
    var params = req.body;

    if (!params.texto_publicacion) return res.status(200).send({ message: 'Debe enviar un texto' });

    var publicacion = new Publicacion();
    publicacion.texto_publicacion = params.texto_publicacion;
    publicacion.archivo_publicacion = 'null';
    publicacion.user = req.user.sub;
    publicacion.fecha_creacion_publicacion = moment().unix();

    publicacion.save((err, publicationStored) => {
        if (err) return res.status(500).send({ message: 'Error al guardar la publicacion' })

        if (!publicationStored) return res.status(404).send({ message: 'La publicacion no ha sido guardada' });

        return res.status(200).send({ publicacion: publicationStored });
    })
}

//Ver todas las publicaciones
function getPublicaciones(req, res) {
    var page = 1;
    if (req.params.page) {
        page = req.params.page;
    }

    var itemsPerPage = 5;

    Follow.find({ user: req.user.sub }).pouplate('seguido').exec((err, follows) => {
        if (err) return res.status(500).send({ message: 'Error al devolver el seguimiento' })

        var follows_clean = [];
        follows.forEach((follow) => {
            follows_clean.push(follow.seguido);
        });

        Publicacion.find({ user: { "$in": follows_clean } }).sort('-fecha_creacion_publicacion').populate('user').paginate(page, itemsPerPage, (err, publications, total) => {
            if (err) return res.status(500).send({ message: 'Error al devolver publicaciones' });

            if (!publications) return res.status(404).send({ message: 'No hay publicaciones' });

            return res.status(200).send({
                total_items: total,
                pages: Math.ceil(total / itemsPerPage),
                page: page,
                items_per_page: itemsPerPage,
                publications
            });
        });

    });
}


//Ver 1 publicacion
function getPublicacion(req, res) {
    var publicacionId = req.params.id;

    Publicacion.findById(publicacionId, (err, publicacion) => {
        if (err) return res.status(500).send({ message: 'Error al devolver publicaciones' });

        if (!publicacion) return res.status(404).send({ message: 'No existe la publicacion' });

        return res.status(200).send({ publicacion });
    })
}


//Eliminar publicacion
function deletePublicacion(req, res) {
    var publicacionId = req.params.id;

    Publicacion.find({ 'user': req.user.sub, '_id': publicacionId }).remove(err => {
        if (err) return res.status(500).send({ message: 'Error al borrar publicaciones' });

        if (!publicacionRemoved) return res.status(404).send({ message: 'No se ha borrado la publicacion' });

        return res.status(200).send({
            message: 'Publicacion eliminada'
        });
    })
}


//Actualizar la imagen de una publicacion
function uploadImage(req, res) {
    var publicationId = require.params.id;

    if (req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\')

        var file_name = file_split[2]
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif') {

            Publicacion.find({ 'user': req.user.sub, '_id': publicationId }).exec((err, publicacion) => {
                if (publicacion) {
                    Publicacion.findByIdAndUpdate(publicationId, { archivo_publicacion: file_name }, { new: true }, (err, publicationUpdated) => {
                        if (err) return res.status(500).send({ message: "Error al actualizar la imagen" });

                        if (!publicationUpdated) return res.status(404).send({ message: "No se ha podido encontrar el usuario" });

                        return res.status(200).send({ Publicacion: publicationUpdated });
                    });
                } else {
                    return removeFilesOfUploads(res, file_path, 'No tienes permiso para actualizar la publicacion');
                }
            });


        } else {
            return removeFilesOfUploads(res, file_path, 'Extension no valida');
        }
    } else {
        res.status(200).send({ message: "No ha enviado ninguna imagen" });
    }
};


//Eliminar los archivos
function removeFilesOfUploads(res, file_path, message) {
    fs.unlink(file_path, (err) => {
        if (err) return res.status(200).send({ message: message })
    });
};

//Metodo para poder leer y guardar la imagen
function getImageFile(req, res) {
    var image_file = req.params.imageFile;
    var path_file = './uploads/publications/' + req.params.image_file;

    fs.exists(image_file, (exist) => {
        if (exist) {
            res.sendFile(image_file);
        } else {
            return res.status(404).send({ message: "La imagen no existe" });
        }
    });
};


module.exports = {
    savePublicacion,
    getPublicaciones,
    getPublicacion,
    deletePublicacion,
    uploadImage,
    getImageFile,
}