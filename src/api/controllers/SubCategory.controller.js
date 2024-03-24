const { Op, Sequelize, } = require("sequelize")
const MESSAGES = require("../constants/messages")
const db = require("../models")

const MainCategoryModel = db.MainCategoryModel
const SubCategoryModel = db.SubCategoryModel
const ManyCategory = db.ManyCategory

// ------------ || Sub Account category Create and Modify Api controller   || ------------ //
const SubCategoryModifyController = async (req, res) => {
    try {
        const payloadBody = req.body
        payloadBody.createdByUserId = req.user.userId
        const findDuplicate = await SubCategoryModel.findOne({
            where: {
                categoryName: payloadBody?.categoryName,
                createdByUserId: payloadBody.createdByUserId
            }
        })
        if (!payloadBody?.subCategoryId) {
            if (!findDuplicate?.subCategoryId) {
                payloadBody.createdAt = new Date
                payloadBody.updatedAt = new Date
                await SubCategoryModel.create(payloadBody).then(async (response) => {
                    await ManyCategory.create({
                        subCategoryId: response?.subCategoryId,
                        categoryId: payloadBody?.categoryId
                    })
                    return res.status(200).send({
                        status: true,
                        message: MESSAGES.CATEGORY_CREATED
                    })
                }).catch(error => {
                    return res.status(200).send({
                        status: false,
                        message: error
                    })
                })

            } else {
                return res.status(200).send({
                    status: false,
                    message: MESSAGES.CATEGORY_DUPLICATE
                })
            }
        } else {
            if ((findDuplicate?.userId && findDuplicate.subCategoryId == payloadBody.subCategoryId) || (!findDuplicate?.subCategoryId)) {
                payloadBody.updatedAt = new Date
                await SubCategoryModel.update(payloadBody, { where: { subCategoryId: payloadBody.subCategoryId } }).then(async (response) => {
                    return res.status(200).send({
                        status: true,
                        message: MESSAGES.CATEGORY_UPDATED
                    })
                }).catch(error => {
                    return res.status(200).send({
                        status: false,
                        message: error
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

// ------------ || Sub Account category as user list api controller   || ------------ //
const SubCategoryFetchListController = async (req, res) => {
    try {
        const payloadBody = req.body
        payloadBody.createdByUserId = req.user.userId
        const listSubCategory = await SubCategoryModel.findAll({
            where: { createdByUserId: payloadBody.createdByUserId },
            raw: true
        })
        return res.status(200).send({
            status: true,
            data: listSubCategory,
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

// ------------ || Sub category Delete api controller   || ------------ //
const SubCategoryDeleteController = async (req, res) => {
    try {
        const payloadParam = req.params
        const payloadUser = req.user
        const targetCategory = await SubCategoryModel.findOne({
            where: {
                subCategoryId: payloadParam.id,
                createdByUserId: payloadUser.userId,
            },
            raw: true
        })
        if (targetCategory?.subCategoryId) {
            await SubCategoryModel.destroy({ where: { subCategoryId: targetCategory.subCategoryId } }).then(async () => {
                await ManyCategory.destroy({ where: { subCategoryId: targetCategory.subCategoryId } })
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
    SubCategoryModifyController,
    SubCategoryFetchListController,
    SubCategoryDeleteController
}