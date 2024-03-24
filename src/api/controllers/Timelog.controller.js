const { Op, Sequelize, } = require("sequelize")
const bcrypt = require('bcrypt');
const MESSAGES = require("../constants/messages")
const db = require("../models");
const moment = require("moment");

const TimeLogsModel = db.TimeLogsModel
const CategoryModel = db.CategoryModel

// ------------ || Timelog Create and Modify Api controller   || ------------ //
const TimelogModifyController = async (req, res) => {
    try {
        const payloadBody = req.body
        const payloadUser = req.user
        payloadBody.createdByUserId = payloadUser.userId


        payloadBody.createdAt = new Date
        payloadBody.updatedAt = new Date
        payloadBody.minutes = Number(payloadBody?.totalTime.split(':').reduce((acc, val, i) => acc + (parseInt(val) * (i === 0 ? 60 : 1)), 0))
        console.log(payloadBody)
        if (!payloadBody?.timelogId) {

            await TimeLogsModel.create(payloadBody).then(() => {
                return res.status(200).send({
                    status: true,
                    message: MESSAGES.TIMELOG_CREATED
                })
            }).catch((error) => {
                return res.status(200).send({
                    status: false,
                    message: error.message
                })
            })
        } else {
            await TimeLogsModel.update(payloadBody, { where: { timelogId: payloadBody.timelogId } }).then(() => {
                return res.status(200).send({
                    status: true,
                    message: MESSAGES.TIMELOG_UPDATED
                })
            }).catch((error) => {
                return res.status(200).send({
                    status: false,
                    message: error.message
                })
            })
        }
    } catch (error) {
        return res.status(500).send({
            status: false,
            message: error.message
        })
    }
}

// ------------ || Timelog as user list api controller   || ------------ //
const TimelogFetchListController = async (req, res) => {
    try {
        const bodyParser = req.body
        const payloadUser = req.user

        const query = {
            isDeleted: false,
            createdByUserId: payloadUser?.userId
        }
        if (bodyParser?.start && bodyParser?.end) {
            query.startTime = {
                [Op.and]: [
                    { [Op.between]: [moment(bodyParser.start, 'DD/MM/YYYY').startOf('day').toDate(), moment(bodyParser.end, 'DD/MM/YYYY').endOf('day').toDate()] },
                    { [Op.between]: [moment(bodyParser.start, 'DD/MM/YYYY').startOf('day').toDate(), moment(bodyParser.end, 'DD/MM/YYYY').endOf('day').toDate()] }
                ]
            };
        }
        if (bodyParser?.category) {
            query.categoryId = {
                [Op.or]: bodyParser?.category
            };
        }
        const timeLogList = await TimeLogsModel.findAll({
            where: query,
            include: [
                {
                    model: CategoryModel,
                    attributes: ['categoryName', 'categoryColor', 'categoryIcon'],
                },
            ],
            attributes: ['timelogId', 'categoryId', 'startTime', 'endTime', 'totalTime', 'details', 'minutes'],
            order: [
                ['startTime', 'DESC'],
                ['timelogId', 'ASC'],
            ],
        })
        return res.status(200).send({
            status: true,
            data: timeLogList,
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

// ------------ || Timelog Delete api controller   || ------------ //
const TimelogDeleteController = async (req, res) => {
    try {
        const payloadParam = req.params
        const payloadUser = req.user

        const targetTimelog = await TimeLogsModel.findOne({
            where: {
                isDeleted: false,
                timelogId: payloadParam.id,
                createdByUserId: payloadUser.userId,
            },
            raw: true
        })
        if (targetTimelog?.timelogId) {
            await TimeLogsModel.update({
                isDeleted: true
            }, { where: { timelogId: targetTimelog.timelogId } }).then(() => {
                return res.status(200).send({
                    status: true,
                    message: MESSAGES.TIMELOG_DELETED
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

// ------------ || Timelog Diagram api controller   || ------------ //
const TimelogDiagramController = async (req, res) => {
    try {
        const payloadBody = req.body
        const payloadUser = req.user

        const query = {
            isDeleted: false,
            createdByUserId: payloadUser?.userId
        }

        if (payloadBody?.start && payloadBody?.end) {
            query.startTime = {
                [Op.and]: [
                    { [Op.between]: [moment(payloadBody.start, 'DD/MM/YYYY').startOf('day').toDate(), moment(payloadBody.end, 'DD/MM/YYYY').endOf('day').toDate()] },
                    { [Op.between]: [moment(payloadBody.start, 'DD/MM/YYYY').startOf('day').toDate(), moment(payloadBody.end, 'DD/MM/YYYY').endOf('day').toDate()] }
                ]
            };
        }
        if (payloadBody?.category) {
            query.categoryId = {
                [Op.or]: payloadBody?.category
            };
        }
        const timeLogList = await TimeLogsModel.findAll({
            where: query,
            include: [
                {
                    model: CategoryModel,
                    attributes: ['categoryName', 'categoryColor', 'categoryIcon'],
                },
            ],
            attributes: ['startTime', 'endTime', 'details', 'minutes'],
            order: [
                ['startTime', 'DESC'],
                ['timelogId', 'ASC'],
            ],
            raw: true
        })

        const groupedTimeLogs = timeLogList.reduce((acc, log) => {
            const categoryId = log['Category.categoryName'];
            const icon = log['Category.categoryIcon'];
            const color = log['Category.categoryColor'];
            if (!acc[categoryId]) {
                acc[categoryId] = [];
            }
            acc[categoryId].push({
                startTime: new Date(log?.startTime).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' }).replace(/\//g, '-'),
                minutes: log?.minutes,
                icon: icon,
                color: color
            });
            return acc;
        }, {});

        const MainArray = []
        const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
        const monthsOfYear = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        for (let index = 0; index < Object.keys(groupedTimeLogs).length; index++) {
            const element = Object.keys(groupedTimeLogs)[index];
            const data = groupedTimeLogs[element]
            var totalMinutesByDay = {}
            let temp = []
            switch (payloadBody?.duration) {
                case "weekly":
                    daysOfWeek.forEach(day => {
                        temp[day] = 0;
                    });
                    data.forEach(entry => {
                        const [day, month, year] = entry.startTime.split('-').map(Number);
                        const date = new Date(2000 + year, month - 1, day);
                        const dayOfWeek = daysOfWeek[date.getDay()];
                        temp[dayOfWeek] += entry.minutes;
                        // console.log({ [dayOfWeek]: temp[dayOfWeek] }, "@@@@");
                    });
                    for (let index = 0; index < Object.keys(temp).length; index++) {
                        const key = Object.keys(temp)[index];
                        const minutes = Object.values(temp)[index];
                        const hours = Math.floor(minutes / 60);
                        const remainingMinutes = (minutes % 60).toString().padStart(2, '0');
                        totalMinutesByDay[key] = parseFloat(hours + '.' + remainingMinutes)

                    }
                    break;
                case "fortnightly":
                    for (let i = 1; i <= Math.ceil(data.length / 15); i++) {
                        temp[`Fortnight ${i}`] = 0;
                    }
                    await data.forEach(entry => {
                        const [day, month, year] = entry.startTime.split('-').map(Number);
                        const dayOfMonth = day;
                        const period = Math.ceil(dayOfMonth / 15);
                        const periodKey = `Fortnight ${period}`;
                        temp[periodKey] += entry.minutes;
                    });
                    for (let index = 0; index < Object.keys(temp).length; index++) {
                        const key = Object.keys(temp)[index];
                        const minutes = Object.values(temp)[index] || 0;
                        // totalMinutesByDay[key] = value || 0;
                        const hours = Math.floor(minutes / 60);
                        const remainingMinutes = (minutes % 60).toString().padStart(2, '0');
                        totalMinutesByDay[key] = parseFloat(hours + '.' + remainingMinutes)
                    }
                    break;
                case "fifteen":
                    totalMinutesByDay = data.reduce((acc, entry) => {
                        const [day, month, year] = entry.startTime.split('-').map(Number);
                        const dayOfMonth = day;
                        const period = Math.ceil(dayOfMonth / 15);

                        const periodKey = `Period ${period}`;
                        acc[periodKey] = (acc[periodKey] || 0) + entry.minutes;
                        return acc;
                    }, {});
                    console.log(totalMinutesByDay);

                    break;
                case "monthly":
                    temp = data.reduce((acc, entry) => {
                        const [day, month, year] = entry.startTime.split('-').map(Number);
                        const date = new Date(2000 + year, month - 1, day);
                        const dayOfMonth = date.getDate();
                        acc[dayOfMonth] = (acc[dayOfMonth] || 0) + entry.minutes;
                        return acc;
                    }, {});
                    for (let index = 1; index <= 31; index++) {
                        const element = temp[index];
                        totalMinutesByDay[index] = element || 0
                    }
                    break;
                case "yearly":
                    monthsOfYear.forEach(month => {
                        temp[month] = 0;
                    });
                    data.forEach(entry => {
                        const [day, month, year] = entry.startTime.split('-').map(Number);
                        const monthName = monthsOfYear[month - 1];
                        temp[monthName] += entry.minutes;
                    });
                    for (let index = 0; index < Object.keys(temp).length; index++) {
                        const key = Object.keys(temp)[index];
                        const minutes = Object.values(temp)[index];
                        // totalMinutesByDay[key] = value

                        const hours = Math.floor(minutes / 60);
                        const remainingMinutes = (minutes % 60).toString().padStart(2, '0');
                        totalMinutesByDay[key] = parseFloat(hours + '.' + remainingMinutes)

                    }
                    break;
                case "daily":
                    const startDate = moment(payloadBody.start, 'DD/MM/YYYY').startOf('day').toDate()
                    const endDate = moment(payloadBody.end, 'DD/MM/YYYY').endOf('day').toDate()

                    for (let currentDate = new Date(startDate); currentDate <= endDate; currentDate.setDate(currentDate.getDate() + 1)) {
                        const day = currentDate.getDate().toString().padStart(2, '0');
                        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
                        const year = currentDate.getFullYear().toString().slice(-2);
                        const formattedDate = `${day}/${month}/${year}`;
                        const totalMinutes = data.reduce((total, entry) => {
                            const [entryDay, entryMonth, entryYear] = entry.startTime.split('-').map(Number);
                            const entryDate = new Date(2000 + entryYear, entryMonth - 1, entryDay);
                            if (entryDate.getTime() === currentDate.getTime()) {
                                total += entry.minutes;
                            }
                            return total;
                        }, 0);
                        temp[formattedDate] = totalMinutes;
                    }
                    for (let index = 0; index < Object.keys(temp).length; index++) {
                        const key = Object.keys(temp)[index];
                        const minutes = Object.values(temp)[index];

                        const hours = Math.floor(minutes / 60);
                        const remainingMinutes = (minutes % 60).toString().padStart(2, '0');
                        totalMinutesByDay[key] = parseFloat(hours + '.' + remainingMinutes)
                    }
                    break;
            }
            MainArray.push({
                key: element,
                icon: groupedTimeLogs[element][0]?.icon,
                color: groupedTimeLogs[element][0]?.color,
                values: totalMinutesByDay
            })
        }

        return res.status(200).send({
            status: true,
            data: MainArray,
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

module.exports = {
    TimelogModifyController,
    TimelogFetchListController,
    TimelogDeleteController,
    TimelogDiagramController
}
