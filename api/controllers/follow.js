'use strict'

var path = require('path');
var fs  = require('fs');
var mongoosePaginate = require('mongoose-pagination');

var User = require('../models/follow');
var Follow = require('../models/follow');

function saveFollow (req, res) {
    var follow = new follow();
    follow.user = req.user.sub;
    follow.seguido = params.seguido

    follow.save((err, followStored) => {
        if(err) return  res.status(500).send({message: "Error al guardar el seguimiento"});

        if(!followStored) return res.status(404).send({message: "No se ha podido guardar el seguimiento"})

        return res.status(200).send({follow: followStored});
    })

}

function deleteFollow(req,res) {
    var userId = req.user.sub;
    var followId = req.params.id;
    
    Follow.find({'user': userId, 'seguido':followId}).remove(err => {
        if(err) return res.status(500).send({message:"Error en la peticion de eliminacion del seguidor"});

        return res.status(200).send({message: 'El follow se ha eliminado'});
    });
}

function getFollowingUsers(req, res) {
    var userId = req.user.sub;
    var page = 1;
    var itemsPerPage = 5;

    if(req.params.id && req.params.page) {
        userId = req.params.id;
    }

    if(req.params.page) {
        page = req.params.page
    } else {
        page = req.params.id
    }

    follow.find({user: userId}).populate({path: 'seguido'}).paginate(page,itemsPerPage,(err, follows, total) => {
        if(err) return res.status(500).send({message:"Error en el servidor"});

        if(!follows) return res.status(404).send({message: 'No estas siguiendo usuarios'})

        return  res.status(200).send({
        total: total,
        pages: Math.ceil(total/itemsPerPage),
        follows
        });
    });

}

function getFollowedUsers(res, req) {
    var userId = req.user.sub;
    var page = 1;
    var itemsPerPage = 5;

    if(req.params.id && req.params.page) {
        userId = req.params.id;
    }

    if(req.params.page) {
        page = req.params.page
    } else {
        page = req.params.id
    }

    follow.find({seguido: userId}).populate('user seguido').paginate(page,itemsPerPage,(err, follows, total) => {
        if(err) return res.status(500).send({message:"Error en el servidor"});

        if(!follows) return res.status(404).send({message: 'No te siguen usuarios'})

        return  res.status(200).send({
        total: total,
        pages: Math.ceil(total/itemsPerPage),
        follows
        });
    });


}

module.exports = {
    saveFollow,
    deleteFollow,
    getFollowingUsers,
    getFollowedUsers
}
