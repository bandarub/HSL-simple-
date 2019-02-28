const express = require('express');
const router = express.Router();
const request = require('request');

const Order = require('../models/order');
let regions;
// Get Homepage
router.get('/', ensureAuthenticated, function(req, res) {
	request('https://sales-api.hsl.fi/api/ticket/v3/get/ticketTypes', function(error, response, body) {
		if (!error && response.statusCode == 200) {
			var info = JSON.parse(body);
			regions = info;
			res.render('index', { regions: info });
		}
	});
});

router.get('/buy/:id', ensureAuthenticated, function(req, res) {
	const id = req.params.id;
	let foundRegion;
	for (let region of regions) {
		if (region.id === id) {
			foundRegion = region;
		}
	}
	const order = new Order({
		user: req.user,
		displayName: foundRegion.displayName,
		description: foundRegion.description
	});
	order.save(err => {
		res.render('buy', { message: 'Ticket Bought successfully' });
	});
	
});

router.get('/orderList', ensureAuthenticated, function(req, res) {
	const userId = req.user._id;
	Order.find({ user: req.user }, function(err, orders) {
		if (err) {
			return res.write('Error!');
		}
		var orderHistory = [];
		orders.forEach(function(order) {
			orderHistory.push(order);
		});
		res.render('orderList', { orders: orderHistory });
	});
});

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	} else {
		// req.flash('error_msg','you are not logged in');
		res.redirect('/users/login');
	}
}

module.exports = router;
