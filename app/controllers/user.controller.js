const User = require('../models/users')
const Referral = require('../models/referral')
const validate = require('../validators/user.validator')
const generateResponse = require('../utils/response')
require("dotenv").config();
const jwt = require('jsonwebtoken')
const jwtPrivateKey = process.env.JWT_PRIVATE_KEY
var randomstring = require("randomstring");
const path = require('path')
const ejs = require('ejs')
const fs = require('fs')
var uuid = require('uuid');
const bcrypt = require('bcrypt');
const referralService = require("../services/referral.service")
const url = require('url')

class UserControl {

    /// Test 1
    async registerUser(req, res) {
        try {
            let { error } = validate.register(req.body)
            if (error) {
                return res.status(400).send({
                    message: "failed",
                    result: error
                })
            }

            const emailExist = await User.findOne({ email: req.body.email })
            if (emailExist) {
                return generateResponse(res, 400, "Email Already Exists")
            }

            //Creates new referral for new user
            const newReferrer = new Referral({
                referralId: uuid.v4(),
                referralLink: uuid.v4(),
                // userId: user._id,
            })

            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt)
            req.body.refId = await newReferrer._id;
            const user = new User(req.body)


            if (req.body.referrer != " ") {
                req.body.referrer =  req.body.referrer.trim()
                //Validate referral code and gets the referrer
                const referral = await referralService.checkReferer({
                    referralId: req.body.referrer,
                })
                let checkuser = await Referral.findOne({referralId : req.body.referrer})
                let addPoint = await User.updateOne({refId : checkuser._id},  {$inc :{point : 5}})
            }

            if (req.query.referrer) {
                // Validate referral link and gets the referrer
                const referral = await referralService.checkReferer({
                    referralId: req.query.referrer,
                })
            }
            
            //save referral to the database and redirect to login
            const savedUser = await user.save()
            await newReferrer.save()

            const customUserResponse = { user: savedUser }
            // customUserResponse.refCode = newReferrer.referralId

            return res
                .status(201)
                .json({ message: "success", data: customUserResponse })
        } catch (err) {
            return res.status(400).json({ error: err.message })
        }
    }

    async loginUser(req, res) {
        try {
            let { error } = validate.login(req.body)
            if (error) {
                return res.status(400).send({
                    message: "failed",
                    result: error
                })
            }

            const user = await User.findOne({ email: req.body.email })
            const validPassword = await bcrypt.compare(req.body.password, user.password)
            if (!validPassword) {
                return res.status(400).json({ error: "Invalid password" })
            }

            const token = jwt.sign({ _id: user._id }, jwtPrivateKey)
            let filepath = path.join(__dirname, '..', 'view', "main.ejs")
            let readhtml = fs.readFileSync(filepath, { encoding: 'utf-8' })
            let str = ejs.render(readhtml, user)
            fs.writeFileSync(path.join(__dirname, '..', 'view', 'writeStream', "home.ejs"), str)

            res.redirect(200, '/homePage');
            //  return res.status(200).json({user:user, token: token })
        } catch (err) {
            return generateResponse(res, 400, err.message)
        }
    }

    async getUser(req, res) {
        try {
            const user = await User.find({}).populate('refId')
            if (!user) {
                throw Error("Invalid credentials")
            }
            return user
        } catch (err) {
            throw Error(err)
        }
    }

    async shareReferralLink(req, res) {
        await Referral.findOne({ _id: req.params.id }) //Populate model with user
            .then(loggedUser => {
                //Generate random referral link
                const generatedRefLink = `${req.protocol}://${req.headers.host}/register?referrer=${loggedUser.referralId}`

                res.status(200).send({
                    status: true,
                    link: generatedRefLink
                })    //   res.render('admin/index', {
                //     loggedUser: loggedUser,
                //     generatedRefLink: generatedRefLink
                //   })
            })
    }

    async shareReferralCode(req, res) {
        await Referral.findOne({ _id: req.params.id }) //Populate model with user
            .then(loggedUser => {
                //Generate random referral link
                const code = loggedUser.referralId

                res.status(200).send({
                    status: true,
                    ReferralCode: code
                })
            })
    }


    //test 2
    async getAllUserwithfriends(req, res) {
        try {

            const user = await User.find({}).populate('refId')
            if (user.length < 1) {
                res.status(404).send({ message: "No user found" })
            }
            let obj = {}
            let list = []
            let friend = []
            for (const x of user) {
                obj = {}
                obj['fullname'] = x.fullname
                obj['email'] = x.email
                obj['point'] = x.point
                obj['refId'] = x.refId
                obj['referrer'] = x.referrer
                friend = []
                // if (x.referrer != " ") {
                    user.map(y => {
                        if (x.refId.referralId == y.referrer) {
                            friend.push(y)
                            console.log('friend')
                        }
                    })
                // }

                obj['friend'] = friend
                list.push(obj)
            }
            console.log(friend)
            res.status(200).send({
                status: true,
                user: list,

            })
        } catch (err) {
            console.log(err)
            res.status(400).send({ error: err })
        }
    }

    async getUserwithCode(req, res) {
        try {

            const user = await User.find({referrer : req.params.code}).populate('refId')
            if (user.length < 1) {
                res.status(404).send({ message: "No user found" })
            }
          
            res.status(200).send({
                status: true,
                user: user,

            })
        } catch (err) {
            console.log(err)
            res.status(400).send({ error: err })
        }
    }

}

module.exports = UserControl;