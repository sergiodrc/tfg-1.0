'use strict'

var moment = require('moment');
var mongoosePaginate = require('mongoose-pagination');

var User = require('../models/user');
var Follow = require('../models/follow');
var Message = require('../models/message');

function saveMessage(req, res) {
    var params = req.body;

    if(!params.text_mensaje || !params.receiver) return res.status(200).send({message: 'Envia los datos necesarios'})

    var message = new Message();
    message.emitter = req.user.sub;
    message.receiver = params.receiver;
    message.text_mensaje = params.text_mensaje;
    message.fecha_creacion_mensaje = moment().unix();
    massage.viewed = 'false';

    message.save((err, messageStored) => {
        if(err) return res.status(500).send({message: 'Error en la peticion'})
        if(!messageStored) return res.status(500).send({message: 'Error al enviar el mensaje'})

        return res.status(200).send({message: messageStored})

    })
};

function getReceivedMessages(req, res) {
    var userId = req.user.sub;

    var page = 1;
    if(req.params.page) {
        page = req.params.page;
    }

    var itemsPerPage = 5;

    Message.find({receiver: userId}).populate('emitter', 'nombre_usuario apellido_usuario imagen_usuario nickname_usuario _id').paginate(page, itemsPerPage, (err, messages, total) => {
        if(err) return res.status(500).send({message: 'Error en la peticion'})
        if(!messages) return res.status(404).send({message: 'No hay mensajes'})

        return res.status(200).send({
            total: total,
            pages: Math.ceil(total/itemsPerPage),
            messages
        })
    })

}

function getEmmitMessages(req, res) {
    var userId = req.user.sub;

    var page = 1;
    if(req.params.page) {
        page = req.params.page;
    }

    var itemsPerPage = 5;

    Message.find({emitter: userId}).populate('emitter receiver', 'nombre_usuario apellido_usuario imagen_usuario nickname_usuario _id').paginate(page, itemsPerPage, (err, messages, total) => {
        if(err) return res.status(500).send({message: 'Error en la peticion'})
        if(!messages) return res.status(404).send({message: 'No hay mensajes'})

        return res.status(200).send({
            total: total,
            pages: Math.ceil(total/itemsPerPage),
            messages
        })
    })

};

function getUnviewedMessages(req, res) {
    var userId = req.user.sub;

    Message.find({receiver: userId, viewed:'false'}).exec((err, count) => {
        if(err) return res.status(500).send({message: 'Error en la peticion'})
        if(!count) return res.status(404).send({message: 'No hay mensajes'})

        return res.status(200).send({
            'unviewed': countt
        })
    })
}

function setViewedMessages(req, res) {
    var userId = req.user.sub;

    Message.update({receiver: userId, viewed: 'false'}, {viewed: 'true'}, {"multi": true}, (err, messageUpdate) => {
        if(err) return res.status(500).send({message: 'Error en la peticion'})
        return res.status(200).send({
            messages: messageUpdate
        })
    })
}

module.exports = {
    saveMessage,
    getReceivedMessages,
    getEmmitMessages,
    getUnviewedMessages,
    setViewedMessages,
}