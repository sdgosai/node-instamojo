
const routes = require("express").Router();


const { createPayment, viewAlllinks, viewRequestlink, viewStatusbypaymentId, getDetails, requestRefund, getStatusById, getAllrefundDetails } = require("../controller/paymentController");

// Redirect Page ...
routes.get('/', (req, res, next) => {
    res.render('home')
})
routes.get('/success', (req, res, next) => {
    res.render('success')
})
routes.get('/error', (req, res, next) => {
    res.render('error')
})
routes.get('/check', (req, res, next) => {
    res.render('check')
})
routes.get('/link', (req, res, next) => {
    res.render('link')
})
routes.get('/success', (req, res) => {
    res.send({
        success: true,
        message: 'Payment successfull'
    })
})

// API routes ...
routes.post('/pay', createPayment)
routes.get('/history', viewAlllinks);
routes.get('/request', viewRequestlink)
routes.post('/status', viewStatusbypaymentId)
routes.post('/details', getDetails)
routes.post('/refund/request', requestRefund)
routes.post('/refund/status', getStatusById)
routes.get('/refund/list', getAllrefundDetails)

module.exports = routes;