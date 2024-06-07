var publicationModel = require("../models/publication");

const fs = require("fs").promises;

var path = require("path");

var moment = require('moment');

async function createPublicationBD(publicationDetails,a) {
  try {
    var publicationModelData = new publicationModel({
      texto_publicacion: publicationDetails.texto_publicacion,
      fecha_creacion_publicacion: moment().unix().toString(),
      user: publicationDetails.nickname_usuario,
    });
    var result = await publicationModelData.save();
    if (result) {
      return { status: true, message: "publicacion creada" };
    } else {
      return { status: false, message: " error al crear la publicacion" };
    }
  } catch (err) {
    console.log("error -> ", err);
    return { status: false, message: "catch" };
  }
}

async function uploadImageBD(publicationImageDetails) {
  try {
    console.log('Archivo -> ',publicationDetails)
    var file_path = publicationDetails.files.archivo_publicacion.path;
    var file_name = path.basename(file_path);
    var file_ext = path.extname(file_name).slice(1);

    if (!["png", "jpg", "jpeg", "gif"].includes(file_ext.toLowerCase())) {
      await removeFilesOfUploads(file_path);
      return { status: false, message: "Extensión no válida" };
    } else {
      return { status: true, message: "foto insertada" };
    }
  } catch (err) {
    console.error(err);
    return { status: false, message: "Error al insertar la imagen" };
  }
}

async function removeFilesOfUploads(file_path) {
  try {
    await fs.unlink(file_path);
  } catch (err) {
    console.error("Error al eliminar el archivo:", err);
  }
}

module.exports = { createPublicationBD, uploadImageBD };
