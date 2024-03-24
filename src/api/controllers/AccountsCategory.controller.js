const { Op, Sequelize, } = require("sequelize")
const MESSAGES = require("../constants/messages")
const db = require("../models")

const AccountsModel = db.AccountsModel
const MainCategoryModel = db.MainCategoryModel
const SubCategoryModel = db.SubCategoryModel
const ManyCategory = db.ManyCategory

// ------------ || Account category Create and Modify Api controller   || ------------ //
const AccountCategoryModifyController = async (req, res) => {
    try {
        const payloadBody = req.body
        const payloadUser = req.user
        payloadBody.createdByUserId = payloadUser.userId

        const findDuplicateCategory = await MainCategoryModel.findOne({
            where: {
                categoryName: payloadBody?.categoryName,
                createdByUserId: payloadBody?.createdByUserId
            },
            raw: true
        });

        if (!payloadBody?.categoryId) {
            payloadBody.createdAt = new Date
            payloadBody.updatedAt = new Date

            if (!findDuplicateCategory?.categoryId) {
                await MainCategoryModel.create(payloadBody).then(() => {
                    return res.status(200).send({
                        status: true,
                        message: MESSAGES.CATEGORY_CREATED
                    })
                }).catch((error) => {
                    return res.status(200).send({
                        status: false,
                        message: error.message
                    })
                })
            } else if (findDuplicateCategory?.categoryId && findDuplicateCategory.isDeleted == true) {
                payloadBody.isDeleted = false
                await MainCategoryModel.update(payloadBody, { where: { categoryId: findDuplicateCategory.categoryId } }).then(() => {
                    return res.status(200).send({
                        status: true,
                        message: MESSAGES.CATEGORY_CREATED
                    })  
                }).catch((error) => {
                    return res.status(200).send({
                        status: false,
                        message: error.message
                    })
                })
            } else {
                return res.status(200).send({
                    status: false,
                    message: MESSAGES.CATEGORY_DUPLICATE
                })
            }
        } else {
            if ((findDuplicateCategory?.categoryId && findDuplicateCategory.categoryId == payloadBody.categoryId && findDuplicateCategory.isDeleted == false) || (!findDuplicateCategory?.categoryId)) {
                const payloadUser = req.user
                payloadBody.createdByUserId = payloadUser.userId

                payloadBody.updatedAt = new Date
                await MainCategoryModel.update(payloadBody, { where: { categoryId: payloadBody.categoryId } }).then(() => {
                    return res.status(200).send({
                        status: true,
                        message: MESSAGES.CATEGORY_UPDATED
                    })
                }).catch((error) => {
                    return res.status(200).send({
                        status: false,
                        message: error.message
                    })
                })
            } else {
                return res.status(200).send({
                    status: false,
                    message: MESSAGES.CATEGORY_DUPLICATE
                })
            }
        }

    } catch (error) {
        return res.status(500).send({
            status: false,
            message: error.message
        })
    }
}

// ------------ || Account category as user list api controller   || ------------ //
const AccountCategoryFetchListController = async (req, res) => {
    try {
        const query = {
            isDeleted: false
        }
        const categoryList = await MainCategoryModel.findAll({
            where: query,
            order: [
                ['categoryName', 'ASC']
            ],
            raw: true
        })
        return res.status(200).send({
            status: true,
            data: categoryList,
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

// ------------ || Account category Delete api controller   || ------------ //
const AccountCategoryDeleteController = async (req, res) => {
    try {
        const payloadParam = req.params
        const payloadUser = req.user

        const findCategory = await ManyCategory.findOne({
            where: {
                categoryId: payloadParam.id,
            },
            raw: true
        })
        if (findCategory?.id) {
            return res.status(200).send({
                status: false,
                message: MESSAGES.CATEGORY_TIMELOG_ASSOCIATED
            })
        }
        const targetCategory = await MainCategoryModel.findOne({
            where: {
                isDeleted: false,
                categoryId: payloadParam.id,
                createdByUserId: payloadUser.userId,
            },
            raw: true
        })
        if (targetCategory?.categoryId) {
            await MainCategoryModel.update({
                isDeleted: true
            }, { where: { categoryId: targetCategory.categoryId } }).then(() => {
                return res.status(200).send({
                    status: true,
                    message: MESSAGES.CATEGORY_DELETED
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
    AccountCategoryModifyController,
    AccountCategoryFetchListController,
    AccountCategoryDeleteController
}

