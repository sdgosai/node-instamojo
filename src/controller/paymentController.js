const instaMojo = require('instamojo-nodejs');

instaMojo.setKeys(process.env.INSTAMOJO_API, process.env.INSTAMOJO_AUTH)
instaMojo.isSandboxMode(true);

exports.createPayment = async (req, res, next) => {
    const { amount, name, email, purpose } = req.body;
    try {
        if (!email) {
            var data = new instaMojo.PaymentData();
            const redirect = 'http://localhost:1000/success';
            data.setRedirectUrl(redirect);
            data.purpose = purpose
            data.name = name;
            data.amount = amount;

            instaMojo.createPayment(data, function (err, response) {
                if (err) {
                    res.redirect('/error')
                } else {
                    var data = JSON.parse(response);
                    req.flash("link", data.payment_request.longurl)
                    res.redirect('/link')
                }
            })

        } else {
            var data = new instaMojo.PaymentData();
            const redirect = 'http://localhost:1000/success';
            data.setRedirectUrl(redirect);
            data.send_email = "True";
            data.purpose = purpose
            data.name = name;
            data.email = email;
            data.amount = amount;

            instaMojo.createPayment(data, function (err, response) {
                if (err) {
                    res.redirect('/error')
                } else {
                    var data = JSON.parse(response);
                    req.flash("link", data.payment_request.longurl)
                    res.redirect('/link')
                }
            })

        }
    } catch (error) {
        console.log(error);
        res.send({
            success: false,
            message: 'Failed',
            err: error.message
        })
    }
}

exports.viewAlllinks = async (req, res) => {
    try {
        instaMojo.seeAllLinks(function (err, response) {
            if (err) {
                res.send(err.message)
            } else {
                var links = []
                for (var i = 0; i <= response.links.length; i++) {
                    links.push(response.links[i])
                }
                // console.log(links);
                res.send(links)
            }
        })
    } catch (error) {
        console.log(error);
        res.send({
            success: false,
            message: 'Failed',
            err: error.message
        });
    }
}

exports.viewRequestlink = async (req, res) => {
    try {
        instaMojo.getAllPaymentRequests(function (error, response) {
            if (error) {
                res.send(error.message)
            } else {
                // console.log(response);
                res.send(response.payment_requests)
            }
        });
    } catch (error) {
        console.log(error);
        res.send({
            success: false,
            message: 'Failed',
            err: error.message
        });
    }
}

exports.viewStatusbypaymentId = async (req, res) => {
    const { id } = req.body
    try {
        instaMojo.getPaymentRequestStatus(id, function (error, response) {
            if (error) {
                console.log(error);
                res.send(error.message)
            } else {
                // console.log(response.payment_request.payments[0]);
                if (response.payment_request.status != 'Completed') {
                    res.send({ success: true, payment: [{ status: response.payment_request.status, amount: response.payment_request.amount }] })
                } else {
                    // res.send({ pay: response.payment_request.payments[0] })
                    res.send({ success: true, payment: [{ status: response.payment_request.status, amount: response.payment_request.amount, buyer: response.payment_request.payments[0].buyer_name }] })
                }
            }
        });
    } catch (error) {
        console.log(error);
        res.send({
            success: false,
            message: 'Failed',
            err: error.message
        });
    }
}

exports.getDetails = async (req, res) => {
    const { payment_id, id } = req.body
    try {
        instaMojo.getPaymentDetails(id, payment_id, function (error, response) {
            if (error) {
                res.send(error.message)
            } else {
                // console.log(response);
                res.send(response)
            }
        });
    } catch (error) {
        console.log(error);
        res.send({
            success: false,
            message: 'Failed',
            err: error.message
        });
    }
}

exports.requestRefund = async (req, res) => {
    const { payment_id, type, reason, amount } = req.body
    try {
        var refund = new instaMojo.RefundRequest();
        refund.payment_id = payment_id;     // This is the payment_id, NOT payment_request_id
        refund.type = type;     // Available : ['RFD', 'TNR', 'QFL', 'QNR', 'EWN', 'TAN', 'PTH']
        refund.body = reason;     // Reason for refund
        refund.setRefundAmount(amount);  // Optional, if you want to refund partial amount
        instaMojo.createRefund(refund, function (error, response) {
            // console.log(response);
            res.send(response)
        });
    } catch (error) {
        console.log(error);
        res.send({
            success: false,
            message: 'Failed',
            err: error.message
        });
    }
}

exports.getStatusById = async (req, res) => {
    const { refund_id } = req.body;
    try {
        instaMojo.getRefundDetails(refund_id, function (error, response) {
            if (error) {
                console.log(error);
                res.send(error.message)
            } else {
                // Refund status at response.refund.status
                // console.log(response);
                var time = new Date(response.refund.created_at).toLocaleString();
                res.send({ refund_by: response.refund.creator_name, status: response.refund.status, refund_at: time })
            }
        });
    } catch (error) {
        console.log(error);
        res.send({
            success: false,
            message: 'Failed',
            err: error.message
        });
    }
}

exports.getAllrefundDetails = async (req, res) => {
    try {
        instaMojo.getAllRefunds(function (error, response) {
            if (error) {
                console.log(error);
                res.send(error.message)
            } else {
                console.log(response);
                res.send(response)
            }
        });
    } catch (error) {
        console.log(error);
        res.send({
            success: false,
            message: 'Failed',
            err: error.message
        });
    }
}