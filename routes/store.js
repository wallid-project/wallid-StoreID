'use strict';

var express = require('express'),
		router = express.Router(),
		conn = require('./../models/store');

router.get('/', function(req, res, next) {
	let idt = (req.query.idt != null && req.query.idt != undefined && req.query.id != '') ? req.query.idt : null,
			wallet_address = (req.query.wa != null && req.query.wa != undefined && req.query.wa != '') ? req.query.wa : null;

	if (idt != null && wallet_address != null) {
		conn.getInfoById(idt, wallet_address, function(err, result) {
			if (err) {
				res.status(500).send({"data": null, "message": err});
			} else {
				if (result.length > 0) {
					res.status(200).send({"data": result, "message": null});
				} else {
					res.status(404).send({"data": null, "message": "No records"});
				}
			}
		});
	} else {
		conn.getAllInfo(function(err, result) {
			if (err) {
				res.status(500).send({"data": null, "message": err});
			} else {
				if (result.length > 0) {
					res.status(200).send({"data": result, "message": null});
				} else {
					res.status(404).send({"data": null, "message": "No records"});
				}
			}
		});
	}
});

router.post('/', function(req, res, next) {
	let request = req.body.dataID.data,
			wallet_address = ( (request.wa != null && request.wa != undefined && request.wa != '') ? request.wa : null ),
			idt = ( (request.idt != null && request.idt != undefined && request.idt != '') ? request.idt : null );

	conn.checkIfExist(idt, wallet_address, function(err, result) {
		if (result !== '') {
			conn.updateInfo(request, function(err, result) {
				if (err) {
					res.status(500).send({"data": null, "message": err});
				} else {
					res.status(200).send({"data": null, "message": "Record updated"});
				}
			});
		} else {
			conn.addInfo(request, function(err, result) {
				if (err) {
					res.status(500).send({"data": null, "message": err});
				} else {
					res.status(200).send({"data": null, "message": "Record created"});
				}
			});
		}
	});
});

module.exports = router;
