const { Op, Sequelize, } = require("sequelize")
var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require("../Models")

const secureKey = process.env.TOKEN_SECURE_KEY
const MESSAGES = require("../constants/messages")
const emailActions = require("../../helpers/Email.helper")

const UserModel = db.UserModel
const UserTypesModel = db.UserTypesModel

// ------------ || Login Controller || ------------ //
const loginController = async (req, res) => {
    try {
        const payloadBody = req.body
        console.log(payloadBody);
        const targetUser = await UserModel.findOne({
            where: {
                [Op.or]: [
                    { email: payloadBody?.email || "" },
                    { mobile: payloadBody?.mobile || "" }
                ],
                isDeleted: false
            },
            include: [{
                model: UserTypesModel
            }]
        })
        if (targetUser?.userId) {
            await bcrypt.compare(payloadBody.password, targetUser.password, function (err, result) {
                if (result) {
                    const tokenPassObj = {
                        userId: targetUser.userId,
                        firstName: targetUser.firstName,
                        email: targetUser.email,
                        mobile: targetUser.mobile,
                        createdAt: targetUser.createdAt,
                    }
                    let userData = {
                        userId: targetUser.userId,
                        firstName: targetUser.firstName,
                        lastName: targetUser.lastName,
                        email: targetUser.email,
                        mobile: targetUser.mobile,
                        themeColor: targetUser.themeColor,
                        role: targetUser.UserType.typeName,
                        roleId: targetUser.UserType.userTypeId
                    }
                    jwt.sign(tokenPassObj, secureKey, { expiresIn: '24h' }, function (err, token) {

                        return res.status(200).send({
                            status: true,
                            token: token,
                            data: userData,
                            message: MESSAGES.LOGIN_SUCCESS
                        })
                    });
                }
                else {
                    return res.status(200).send({
                        status: false,
                        message: MESSAGES.PASSWORD_NOT_VALID
                    })
                }
            })

        } else {
            return res.status(200).send({
                status: false,
                message: MESSAGES.USER_NOT_VALID
            })
        }

    } catch (error) {
        console.log(`\x1b[91m ${error} \x1b[91m`)
        return res.status(500).send({
            status: false,
            message: error.message
        })
    }
}

// ------------ || Forget Password Controller || ------------ //
const forgotPasswordController = async (req, res) => {
    try {
        const payloadBody = req.body
        const targetUser = await UserModel.findOne({
            where: {
                [Op.or]: [
                    { email: payloadBody?.email || "" },
                    { mobile: payloadBody?.mobile || "" }
                ],
                isDeleted: false
            },
            raw: true
        })
        if (targetUser?.userId) {
            const min = 10000;
            const max = 99999;
            const optNumber = Math.floor(Math.random() * (max - min + 1)) + min;
            const emailDetails = {
                to: "mahesh.chudasama098@gmail.com",
                optNumber: optNumber
            }
            await emailActions.emailForgetPasswordSendOTP(emailDetails)
            await UserModel.update(
                { authOpt: optNumber },
                { where: { userId: targetUser.userId } }).then(async (response) => {
                    return res.status(200).send({
                        status: true,
                        message: MESSAGES.EMAIL_OPT
                    })
                }).catch((error) => {
                    console.log(`\x1b[91m ${error} \x1b[91m`)
                    return res.status(200).send({
                        status: false,
                        message: error.message
                    })
                })
        } else {
            return res.status(200).send({
                status: false,
                message: MESSAGES.USER_NOT_VALID
            })
        }
    } catch (error) {
        console.log(`\x1b[91m ${error} \x1b[91m`)
        return res.status(500).send({
            status: false,
            message: error.message
        })
    }
}

// ------------ || Change and Reset password  Controller || ------------ //
const resetPasswordController = async (req, res) => {
    try {
        const payloadBody = req.body
        const targetUser = await UserModel.findOne({
            where: {
                [Op.or]: [
                    { email: payloadBody?.email || "" },
                    { mobile: payloadBody?.mobile || "" }
                ],
                isDeleted: false
            },
            raw: true
        })

        if (payloadBody?.optNum && targetUser?.userId) {

            const matchFindOpt = await UserModel.findOne({
                where: {
                    userId: targetUser.userId,
                    authOpt: payloadBody.optNum
                }, raw: true
            })
            if (matchFindOpt?.userId) {
                await UserModel.update({
                    authOpt: null,
                    password: bcrypt.hashSync(payloadBody.password, 10)
                },
                    { where: { userId: matchFindOpt.userId } }).then(async (response) => {
                        return res.status(200).send({
                            status: true,
                            message: MESSAGES.CHANGE_PASSWORD
                        })
                    }).catch((error) => {
                        console.log(`\x1b[91m ${error} \x1b[91m`)
                        return res.status(200).send({
                            status: false,
                            message: error.message
                        })
                    })
            } else {
                return res.status(200).send({
                    status: false,
                    message: MESSAGES.OTP_NOT_MATCH
                })
            }

        } else if (payloadBody?.oldPassword && targetUser?.userId) {
            await bcrypt.compare(payloadBody.oldPassword, targetUser.password, async function (err, result) {
                if (result) {
                    await UserModel.update({
                        password: bcrypt.hashSync(payloadBody.password, 10)
                    },
                        { where: { userId: targetUser.userId } }).then(async (response) => {
                            return res.status(200).send({
                                status: true,
                                message: MESSAGES.CHANGE_PASSWORD
                            })
                        }).catch((error) => {
                            console.log(`\x1b[91m ${error} \x1b[91m`)
                            return res.status(200).send({
                                status: false,
                                message: error.message
                            })
                        })
                } else {
                    return res.status(200).send({
                        status: false,
                        message: MESSAGES.CURRENT_PASSWORD_NOT_VALID
                    })
                }
            })
        } else {
            return res.status(200).send({
                status: false,
                message: MESSAGES.USER_NOT_VALID
            })
        }
    } catch (error) {
        console.log(`\x1b[91m ${error} \x1b[91m`)
        return res.status(500).send({
            status: false,
            message: error.message
        })
    }
}

module.exports = {
    loginController,
    forgotPasswordController,
    resetPasswordController
}