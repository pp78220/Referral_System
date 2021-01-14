const express = require("express")
const router = express.Router()
const ReferralControl = require("../controllers/referral.controller")

let referral = new ReferralControl();

router.get("/", referral.getReferral)

module.exports = router