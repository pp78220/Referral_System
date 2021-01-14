const User = require('../models/users')
const Referral = require('../models/referral')

class ReferralControl {

    async getReferral(req,res){
        try {
            const referral = await Referral.find({})
            if (!referral) {
              throw Error("Referral doesn't exist")
            }
            return res
            .status(201)
            .json({ message: "success", data: referral })
          } catch (err) {
            throw Error(err)
          }
    }
}

module.exports = ReferralControl;