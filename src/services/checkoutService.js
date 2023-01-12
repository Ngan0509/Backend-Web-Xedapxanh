import pool from "../configs/connectDB";
import * as emailService from "./emailService"
import { v4 as uuidv4 } from 'uuid';
require('dotenv').config()

const buildURLEmail = (token) => {
    let result = `${process.env.URL_REACT}/home/cart/ordercomplete?token=${token}`
    return result
}
const handleGetAllCheckout = (checkoutId, role) => {
    return new Promise(async (resolve, reject) => {
        try {
            let checkouts = []
            if (!checkoutId) {
                resolve({
                    errCode: 1,
                    errMessage: 'missing parameter'
                })
            }
            if (checkoutId === "All") {
                if (role === 'AdminS2') {
                    const { rows } = await pool.query('SELECT * FROM "Checkout" WHERE "statusId"= $1', ['S2'])
                    checkouts = rows
                } else if (role === 'ShipperS3') {
                    const { rows } = await pool.query('SELECT * FROM "Checkout" WHERE "statusId"= $1', ['S3'])
                    checkouts = rows
                } else if (role === 'ShipperS4') {
                    const { rows } = await pool.query('SELECT * FROM "Checkout" WHERE "statusId"= $1', ['S4'])
                    checkouts = rows
                } else if (role === 'ShipperS5') {
                    const { rows } = await pool.query('SELECT * FROM "Checkout" WHERE "statusId"= $1', ['S5'])
                    checkouts = rows
                } else if (role === 'AdminS6') {
                    const { rows } = await pool.query('SELECT * FROM "Checkout" WHERE "statusId"= $1', ['S6'])
                    checkouts = rows
                } else {
                    const { rows } = await pool.query('SELECT * FROM "Checkout"')
                    checkouts = rows
                }
            } else if (checkoutId && checkoutId !== 'All' && role === 'Client') {
                const { rows } = await pool.query('SELECT * FROM "Checkout" WHERE client_id= $1', [checkoutId])
                checkouts = rows
            }

            const { rows: clients } = await pool.query('SELECT "id", "fullname", "email", "phoneNumber", "genderId" FROM "Client"')

            const { rows: allcode } = await pool.query('SELECT "keyMap", "valueEn", "valueVi" FROM "Allcodeuser"')

            const { rows: orderDetails } = await pool.query('SELECT * FROM "Detail_Order"')

            const { rows: bicycles } = await pool.query('SELECT "id", "name", "image", "price_new", "price_old" FROM "Bicycle"')
            const { rows: accessories } = await pool.query('SELECT "id", "name", "image", "price_new" FROM "Accessories"')

            let result = checkouts.map((checkout) => {
                let clientData = {}
                if (clients.length > 0) {
                    clients.forEach(client => {
                        if (client.id === checkout.client_id) {
                            clientData = {
                                fullname: client.fullname,
                                email: client.email,
                                phoneNumber: client.phoneNumber,
                                genderId: client.genderId
                            }
                        }
                    })
                }

                let orderDetailArr = []
                if (orderDetails.length > 0) {
                    orderDetails.forEach(order => {
                        if (order.checkout_id === checkout.id) {
                            orderDetailArr.push(order)
                        }
                    })
                }

                if (orderDetailArr.length > 0) {
                    let productData = {}
                    orderDetailArr = orderDetailArr.map(item => {
                        if (item.type === 'BICYCLE') {
                            bicycles.forEach(bicycle => {
                                let imageBase64 = ''
                                if (bicycle.image) {
                                    imageBase64 = Buffer.from(bicycle.image, 'base64').toString('binary')
                                }
                                if (bicycle.id === item.product_id) {
                                    productData = {
                                        name: bicycle.name,
                                        image: imageBase64,
                                        price_new: bicycle.price_new,
                                        price_old: bicycle.price_old,
                                    }
                                }
                            })
                        } else if (item.type === 'ACCESSORIES') {
                            accessories.forEach(accessory => {
                                let imageBase64 = ''
                                if (accessory.image) {
                                    imageBase64 = Buffer.from(accessory.image, 'base64').toString('binary')
                                }
                                if (accessory.id === item.product_id) {
                                    productData = {
                                        name: accessory.name,
                                        image: imageBase64,
                                        price_new: accessory.price_new
                                    }
                                }
                            })
                        }
                        return {
                            ...item,
                            productData
                        }
                    })
                }

                let deliveryData = {}, paymentData = {}, statusData = {}
                allcode.forEach((item) => {
                    if (item.keyMap === checkout.delivery_id) {
                        deliveryData = {
                            valueEn: item.valueEn,
                            valueVi: item.valueVi
                        }
                    }

                    if (item.keyMap === checkout.payment_id) {
                        paymentData = {
                            valueEn: item.valueEn,
                            valueVi: item.valueVi
                        }
                    }

                    if (item.keyMap === checkout.statusId) {
                        statusData = {
                            valueEn: item.valueEn,
                            valueVi: item.valueVi
                        }
                    }
                })
                return {
                    ...checkout,
                    clientData,
                    deliveryData,
                    paymentData,
                    statusData,
                    orderDetailArr
                }
            })

            resolve({
                errCode: 0,
                errMessage: 'Get data is success',
                data: result
            })
        } catch (error) {
            reject(error)
        }
    })
}

const handleCreateNewCheckout = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let token = uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'

            const { noi_nhan, ghi_chu, city_id, district_id, delivery_id, payment_id, client_id, sum_price, date, lang, statusId, listAllCart } = data

            await pool.query(
                'INSERT INTO "Checkout"("noi_nhan", "ghi_chu", "city_id", "district_id", "delivery_id", "payment_id", "client_id", "sum_price", "date", "statusId", "token") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)',
                [noi_nhan, ghi_chu, city_id, district_id, delivery_id, payment_id, client_id, sum_price, date, statusId, token]
            );

            const { rows: checkouts } = await pool.query('SELECT "id" FROM "Checkout" WHERE token = $1', [token])
            const checkout_id = checkouts[0].id

            if (listAllCart && listAllCart.length > 0) {
                listAllCart.forEach(async (item) => {
                    const { product_id, type, so_luong, price, sum_price } = item

                    await pool.query(
                        'INSERT INTO "Detail_Order"("checkout_id", "product_id", "type", "so_luong", "price", "sum_price") VALUES ($1, $2, $3, $4, $5, $6)',
                        [checkout_id, product_id, type, so_luong, price, sum_price]
                    );
                })
            }

            let { rows: deliverys } = await pool.query('SELECT * FROM "Allcodeuser" WHERE "keyMap" = $1', [delivery_id])

            let { rows: payments } = await pool.query('SELECT * FROM "Allcodeuser" WHERE "keyMap" = $1', [payment_id])

            let { rows: clients } = await pool.query('SELECT * FROM "Client" WHERE id = $1', [client_id])

            let orderDetails = listAllCart;

            let deliveryData = {}, paymentData = {}, clientData = {}

            clientData = clients[0]

            deliveryData = {
                valueVi: deliverys[0].valueVi,
                valueEn: deliverys[0].valueEn
            }

            paymentData = {
                valueVi: payments[0].valueVi,
                valueEn: payments[0].valueEn
            }

            let dateData = new Date(Number(date))

            await emailService.sendSimpleEmail({
                recieverEmail: clientData.email,
                noi_nhan,
                ghi_chu,
                sum_price,
                clientName: clientData.fullname,
                deliveryData,
                paymentData,
                orderDetails,
                dateData,
                lang,
                redirect: buildURLEmail(token)
            })

            resolve({
                errCode: 0,
                errMessage: "Create new checkout is success"
            })


        } catch (error) {
            reject(error)
        }
    })
}

const handleUpdateStatusIdCheckout = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { token, statusId } = data
            const { rows } = await pool.query('SELECT * FROM "Checkout" WHERE token = $1', [token])
            let checkout = rows[0]
            if (!checkout) {
                resolve({
                    errCode: 2,
                    errMessage: "checkout is not found"
                })
            }

            if (statusId === 'S1') {
                await pool.query('UPDATE "Checkout" SET "statusId"= $1 where "token" = $2',
                    ['S2', token]
                );
            } else if (statusId === 'S2') {
                await pool.query('UPDATE "Checkout" SET "statusId"= $1 where "token" = $2',
                    ['S3', token]
                );
            } else if (statusId === 'S3') {
                await pool.query('UPDATE "Checkout" SET "statusId"= $1 where "token" = $2',
                    ['S4', token]
                );
            } else if (statusId === 'S4') {
                await pool.query('UPDATE "Checkout" SET "statusId"= $1 where "token" = $2',
                    ['S5', token]
                );
            } else if (statusId === 'S5') {
                await pool.query('UPDATE "Checkout" SET "statusId"= $1 where "token" = $2',
                    ['S6', token]
                );
            } else if (statusId === 'Cancel') {
                await pool.query('UPDATE "Checkout" SET "statusId"= $1 where "token" = $2',
                    ['S7', token]
                );
            } else if (statusId === 'S7') {
                await pool.query('UPDATE "Checkout" SET "statusId"= $1 where "token" = $2',
                    ['S2', token]
                );
            }
            resolve({
                errCode: 0,
                errMessage: "Update data is succeed!"
            })
        } catch (error) {
            reject(error)
        }
    })
}

export {
    handleCreateNewCheckout, handleGetAllCheckout, handleUpdateStatusIdCheckout
}