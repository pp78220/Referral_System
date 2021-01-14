const express = require("express")
const router = express.Router()
const UserControl = require("../controllers/user.controller")

let user = new UserControl();
//Task 2
router.get("/get-users-with-friends", user.getAllUserwithfriends)

router.get("/get-users-code/:code", user.getUserwithCode)
//Task 1

router.post("/register", user.registerUser)

router.post("/login", user.loginUser)

router.get("/", user.getUser)

router.get("/:id", user.shareReferralLink)

router.get("/code/:id", user.shareReferralCode)





module.exports = router