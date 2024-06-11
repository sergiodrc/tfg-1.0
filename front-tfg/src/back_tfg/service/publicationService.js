var publicationModel = require("../models/publication");

const fs = require("fs").promises;

var path = require("path");

var moment = require("moment");

async function createPublicationBD(publicationDetails) {
  console.log('aaaa ' ,publicationDetails.body)
  try {
    var publicationModelData = new publicationModel({
      texto_publicacion: publicationDetails.body.texto_publicacion,
      fecha_creacion_publicacion: moment().unix().toString(),
      user: publicationDetails.body.nickname_usuario,
      archivo_publicacion: await uploadImageBD(publicationDetails.body),
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

async function uploadImageBD(publicationDetails) {
  try {
    console.log('-> ',publicationDetails)
    var file_path = publicationDetails.archivo_publicacion;
    console.log(file_path)
    var file_name = path.basename(file_path);
    var file_ext = path.extname(file_name).slice(1);

    if (!["png", "jpg", "jpeg", "gif"].includes(file_ext.toLowerCase())) {
      await removeFilesOfUploads(file_path);
      return { status: false, message: "Extensión no válida" };
    } else {
      return file_name;
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

async function deletePublicationBD(publicationDetails) {
  try {
    var findPublication = await publicationModel.findOne({
      _id: publicationDetails._id,
    });

    if (!findPublication) {
      console.error("Publicación no encontrada.");
      return;
    }
    console.log("Documento encontrado ->", findPublication);
    var fileDetails = findPublication.archivo_publicacion;
    let file_path = "./uploads/publications/" + fileDetails;
    console.log("Ruta del archivo ->", file_path);
    await removeFilesOfUploads(file_path);
    let result = await publicationModel.deleteOne({
      _id: publicationDetails._id,
    });

    if (result) {
      return { status: true, message: "publication deleted Successfully" };
    } else {
      return { status: false, message: "The publication does not deleted" };
    }
  } catch (error) {
    return { status: false, message: "Error in the publication elimination" };
  }
}

async function updatePublicationBD(publicationDetails) {
  try {
    var findPublication = await publicationModel.findOne({
      _id: publicationDetails.body._id,
    })

    if (!findPublication) {
      console.error("Publicación no encontrada.");
      return;
    }
    console.log("Documento encontrado ->", findPublication);
    var fileDetails = findPublication.archivo_publicacion;
    let file_path = "./uploads/publications/" + fileDetails;
    console.log("Ruta del archivo ->", file_path);
    await removeFilesOfUploads(file_path);
    let result = await publicationModel.updateOne(
      { _id: publicationDetails.body._id },
      {
        texto_usuario: publicationDetails.body.texto_publicacion,
        archivo_publicacion: await uploadImageBD(publicationDetails.files),
      }
    );
    if (result) {
      return { status: true, message: "publication updated Successfully" };
    } else {
      return { status: false, message: "the publication does not updated" };
    }
  } catch (err) {
    return { status: false, message: "Method error" };
  }
}

async function getAllPublicationsBD() {
  try {
    let result = await publicationModel.find({})
    console.log(result)
    if (result) {
      return { status: true, message: "Showing all Publications..."}
    } else {
      return { status: false, message: "Error showing the publications"}
    }
  } catch(err) {
    return { status: false, message: "Method error"}
  }
}

module.exports = {
  createPublicationBD,
  uploadImageBD,
  deletePublicationBD,
  updatePublicationBD,
  getAllPublicationsBD
};