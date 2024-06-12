var publicationModel = require("../models/publication");

const fs = require("fs").promises;

var path = require("path");

var moment = require("moment");

async function createPublicationBD(publicationDetails) {
  try {
    let uploadResponse = await uploadImagePub(publicationDetails);

    if (uploadResponse.status) {
        let file_name = uploadResponse.file_name;

        var publicationModelData = new publicationModel({
            texto_publicacion: publicationDetails.body.texto_publicacion,
            fecha_creacion_publicacion: moment().unix().toString(),
            user: publicationDetails.body.user,
            archivo_publicacion: file_name, // Assign the file name directly
        });

        await publicationModelData.save();
        return { status: true, message: "Publication created successfully" };
    } else {
        return { status: false, message: uploadResponse.message };
    }
} catch (error) {
    console.error(error);
    return { status: false, message: "Error creating publication" };
}
}

async function uploadImagePub(req, res) {
  try {
    if (req.files && req.files.archivo_publicacion) {
        let file_path = req.files.archivo_publicacion.path;
        let file_name = path.basename(file_path);
        let file_ext = path.extname(file_name).slice(1);

        if (!["png", "jpg", "jpeg", "gif"].includes(file_ext.toLowerCase())) {
            await removeFilesOfUploads(file_path);
            return { status: false, message: "Invalid file extension" };
        } else {
            // Only return the file name
            return { status: true, file_name: file_name };
        }
    } else {
        return { status: false, message: "No file uploaded" };
    }
} catch (error) {
    console.error(error);
    return { status: false, message: "An error occurred while uploading the image" };
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
    console.log(publicationDetails)
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
    console.log(result)
    if (result) {
      return { status: true, message: "Publicacion eliminada correctamente" };
    } else {
      return { status: false, message: "La publicacion no ha sido eliminada" };
    }
  } catch (error) {
    return { status: false, message: "Error al eliminar" };
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
      return { status: true, message: "Publicacion actualizada correctamente" };
    } else {
      return { status: false, message: "La publicacion no ha sido actualizada" };
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
      return { status: true, publications: result}
    } else {
      return { status: false, message: "Error showing the publications"}
    }
  } catch(err) {
    return { status: false, message: "Method error"}
  }
}

async function getMyPublicationsBD(publicationDetails) {
  try {
    console.log(publicationDetails)
    let result = await publicationModel.find({user: publicationDetails.email})
    console.log(result)
    if (result) {
      return { status: true, publications: result}
    } else {
      return { status: false, message: "Error showing the publications"}
    }
  } catch(err) {
    return { status: false, message: "Method error"}
  }
}

async function getMyPublicationsBD(publicationDetails) {
  try {
    console.log(publicationDetails)
    let result = await publicationModel.find({user: publicationDetails.email})
    console.log(result)
    if (result) {
      return { status: true, publications: result}
    } else {
      return { status: false, message: "Error al mostrar publicaciones"}
    }
  } catch(err) {
    return { status: false, message: "Error"}
  }
}

module.exports = {
  createPublicationBD,
  uploadImagePub,
  deletePublicationBD,
  updatePublicationBD,
  getAllPublicationsBD,
  getMyPublicationsBD
};