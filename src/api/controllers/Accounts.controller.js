const { Op, Sequelize, } = require("sequelize")
const MESSAGES = require("../constants/messages")
const db = require("../models")

const AccountsModel = db.AccountsModel
const AccountTypeModel = db.AccountTypeModel

// ------------ || Account Create and Modify Api controller   || ------------ //
const AccountModifyController = async (req, res) => {
    try {
        const payloadBody = req.body
        const payloadUser = req.user
        payloadBody.createdByUserId = payloadUser.userId
        const accountTarget = await AccountsModel.findOne({
            where: {
                accountName: payloadBody?.accountName,
                createdByUserId: payloadBody.createdByUserId
            },
            raw: true
        })

        if (!payloadBody?.accountId) {
            if (!accountTarget?.accountId) {
                payloadBody.createdAt = new Date
                payloadBody.updatedAt = new Date
                await AccountsModel.create(payloadBody).then(() => {
                    return res.status(200).send({
                        status: true,
                        message: MESSAGES.ACCOUNT_CREATED
                    })
                }).catch(error => {
                    return res.status(200).send({
                        status: false,
                        message: error.message
                    })
                })
            } else {
                return res.status(200).send({
                    status: false,
                    message: MESSAGES.ACCOUNT_DUPLICATE
                })
            }
        } else {
            if ((accountTarget?.accountId && accountTarget.accountId == payloadBody.accountId) || (!accountTarget?.accountId)) {
                payloadBody.updatedAt = new Date
                await AccountsModel.update(payloadBody, { where: { accountId: payloadBody?.accountId } }).then(() => {
                    return res.status(200).send({
                        status: true,
                        message: MESSAGES.ACCOUNT_UPDATED
                    })
                }).catch(error => {
                    return res.status(200).send({
                        status: false,
                        message: error.message
                    })
                })
            } else {
                return res.status(200).send({
                    status: false,
                    message: MESSAGES.ACCOUNT_DUPLICATE
                })
            }
        }
    } catch (error) {
        console.log(`\x1b[91m ${error.message} \x1b[91m`)
        return res.status(500).send({
            status: false,
            message: error.message
        })
    }
}

// ------------ || Account as user list api controller   || ------------ //
const AccountFetchListController = async (req, res) => {
    try {
        const payloadParam = req.user
        const query = {
            createdByUserId: payloadParam.userId,
        }

        const accountList = await AccountsModel.findAll({
            where: query,
            order: [
                ['accountId', 'ASC'],
            ],
            include: [{ model: AccountTypeModel }],
        })
        return res.status(200).send({
            status: true,
            data: accountList,
            message: MESSAGES.SUCCESS
        })

    } catch (error) {

        console.log(`\x1b[91m ${error} \x1b[91m`)
        return res.status(500).send({
            status: false,
            message: error.message
        })
    }
}

// ------------ || Account Delete api controller   || ------------ //
const AccountDeleteController = async (req, res) => {
    try {
        const payloadParam = req.params
        const payloadUser = req.user

        const targetAccount = await AccountsModel.findOne({
            where: {
                accountId: payloadParam.id,
                createdByUserId: payloadUser.userId,
            },
            raw: true
        })
        if (targetAccount?.accountId) {
            await AccountsModel.destroy({ where: { accountId: targetAccount.accountId } }).then(() => {
                return res.status(200).send({
                    status: true,
                    message: MESSAGES.ACCOUNT_DELETED
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
                message: MESSAGES.ERROR
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
    AccountModifyController,
    AccountFetchListController,
    AccountDeleteController
}

