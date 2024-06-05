

let PublicationService = require("../service/publicationService");

async function createPublicacion(req, res) {
    try {
        // Obtener los datos de la solicitud
        const { texto_publicacion, archivo_publicacion, fecha_creacion_publicacion, user } = req.body;

        // Crear una nueva instancia del modelo de publicación con los datos de la solicitud
        const nuevaPublicacion = new PublicacionModel({
            texto_publicacion,
            archivo_publicacion,
            fecha_creacion_publicacion,
            user
        });

        // Guardar la nueva publicación en la base de datos
        const resultado = await nuevaPublicacion.save();

        // Enviar una respuesta al cliente
        res.status(201).json({ status: true, msg: "Publicación creada exitosamente", result: resultado });
    } catch (error) {
        // Manejar errores
        console.error("Error al crear la publicación:", error);
        res.status(500).json({ status: false, msg: "Error al crear la publicación", error: error.message });
    }
}

async function getPublicacion(req, res) {
    try {
        // Obtener el ID de la publicación de los parámetros de la solicitud
        const { publicacionId } = req.params;

        // Buscar la publicación por ID
        const result = await PublicacionModel.findById(publicacionId).populate('user');

        // Comprobar si se encontró la publicación
        if (result) {
            res.status(200).json({ status: true, msg: "Publicación encontrada exitosamente", result: result });
        } else {
            res.status(404).json({ status: false, msg: "Publicación no encontrada" });
        }
    } catch (error) {
        // Manejar errores
        console.error("Error al obtener la publicación:", error);
        res.status(500).json({ status: false, msg: "Error al obtener la publicación", error: error.message });
    }
}

async function updatePublicacion(req, res) {
    try {
        // Obtener el ID de la publicación de los parámetros de la solicitud
        const { publicacionId } = req.params;

        // Actualizar la publicación
        const result = await PublicacionModel.findByIdAndUpdate(
            publicacionId,
            req.body, // Utilizar los datos de la solicitud para actualizar la publicación
            { new: true }
        );

        // Comprobar si se actualizó correctamente
        if (result) {
            res.status(200).json({ status: true, msg: "Publicación actualizada exitosamente", result: result });
        } else {
            res.status(404).json({ status: false, msg: "Error al actualizar la publicación" });
        }
    } catch (error) {
        // Manejar errores
        console.error("Error al actualizar la publicación:", error);
        res.status(500).json({ status: false, msg: "Error al actualizar la publicación", error: error.message });
    }
}

async function deletePublicacion(req, res) {
    try {
        // Obtener el ID de la publicación de los parámetros de la solicitud
        const { publicacionId } = req.params;

        // Eliminar la publicación por ID
        const result = await PublicacionModel.findByIdAndDelete(publicacionId);

        // Comprobar si se eliminó correctamente
        if (result) {
            res.status(200).json({ status: true, msg: "Publicación eliminada exitosamente" });
        } else {
            res.status(404).json({ status: false, msg: "Error al eliminar la publicación" });
        }
    } catch (error) {
        // Manejar errores
        console.error("Error al eliminar la publicación:", error);
        res.status(500).json({ status: false, msg: "Error al eliminar la publicación", error: error.message });
    }
}

module.exports = { createPublicacion, getPublicacion, updatePublicacion, deletePublicacion };
