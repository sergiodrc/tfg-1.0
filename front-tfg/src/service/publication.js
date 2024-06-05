'use strict';

var PublicacionModel = require('../models/publicacion');

async function createPublicacionDB(publicacionDetails) {
    try {
        // Crear una nueva instancia del modelo de publicación
        const publicacionModelData = new PublicacionModel({
            texto_publicacion: publicacionDetails.texto_publicacion,
            archivo_publicacion: publicacionDetails.archivo_publicacion,
            fecha_creacion_publicacion: publicacionDetails.fecha_creacion_publicacion,
            user: publicacionDetails.user // Asignar el ID del usuario relacionado
        });

        // Guardar la nueva publicación en la base de datos
        const result = await publicacionModelData.save();
        return { status: true, msg: "Publicación creada exitosamente", result: result };
    } catch (error) {
        console.log("Error:", error);
        return { status: false, msg: "Error al crear la publicación", error: error.message };
    }
}

async function getPublicacionDB(publicacionDetails) {
    try {
        // Buscar la publicación por ID
        let result = await PublicacionModel.findById(publicacionDetails.publicacionId).populate('user');
        // Comprobar si se encontró la publicación
        if (result) {
            return { status: true, msg: "Publicación encontrada exitosamente", result: result };
        } else {
            return { status: false, msg: "Publicación no encontrada" };
        }
    } catch (error) {
        console.log("Error:", error);
        return { status: false, msg: "Detalles del error de la publicación", error: error.message };
    }
}

async function updatePublicacionBD(publicacionDetails) {
    try {
        // Actualizar la publicación
        let result = await PublicacionModel.findByIdAndUpdate(
            publicacionDetails.publicacionId,
            {
                texto_publicacion: publicacionDetails.texto_publicacion,
                archivo_publicacion: publicacionDetails.archivo_publicacion,
                fecha_creacion_publicacion: publicacionDetails.fecha_creacion_publicacion
            },
            { new: true }
        );
        // Comprobar si se actualizó correctamente
        if (result) {
            return { status: true, msg: "Publicación actualizada exitosamente", result: result };
        } else {
            return { status: false, msg: "Error al actualizar la publicación" };
        }
    } catch (error) {
        console.log("Error:", error);
        return { status: false, msg: "Error al actualizar la publicación", error: error.message };
    }
}

async function deletePublicacionBD(publicacionDetails) {
    try {
        // Eliminar la publicación por ID
        let result = await PublicacionModel.findByIdAndDelete(publicacionDetails.publicacionId);
        // Comprobar si se eliminó correctamente
        if (result) {
            return { status: true, msg: "Publicación eliminada exitosamente" };
        } else {
            return { status: false, msg: "Error al eliminar la publicación" };
        }
    } catch (error) {
        console.log("Error:", error);
        return { status: false, msg: "Error al eliminar la publicación", error: error.message };
    }
}

module.exports = { createPublicacionDB, getPublicacionDB, updatePublicacionBD, deletePublicacionBD };
