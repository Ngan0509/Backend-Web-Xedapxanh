import pool from "../configs/connectDB";
import bcrypt from 'bcryptjs';
var Buffer = require('buffer/').Buffer
const salt = bcrypt.genSaltSync(10);

const handleGetAllAccessory = (accessoryId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let accessories = ""
            if (accessoryId === "All") {
                const { rows } = await pool.query('SELECT "id", "category_id", "name", "image", "price_new", "accessories_id" FROM "Accessories"')
                accessories = rows
            }
            if (accessoryId && accessoryId !== "All") {
                const { rows } = await pool.query('SELECT "id", "category_id", "name", "image", "price_new", "accessories_id" FROM "Accessories" WHERE category_id = $1', [accessoryId])
                accessories = rows
            }

            const { rows: categories } = await pool.query('SELECT * FROM "Categogy"')


            accessories = accessories.map(accessory => {
                let imageBase64 = ''
                if (accessory.image) {
                    imageBase64 = Buffer.from(accessory.image, 'base64').toString('binary')
                }

                let categoryData = {}
                categories.forEach((item) => {
                    if (item.id === accessory.category_id) {
                        categoryData = {
                            valueEn: item.nameEn,
                            valueVi: item.nameVi
                        }
                    }
                })

                return {
                    ...accessory,
                    image: imageBase64,
                    categoryData
                }
            })

            resolve({
                errCode: 0,
                errMessage: 'Get data is success',
                data: accessories
            })
        } catch (error) {
            reject(error)
        }
    })
}

const handleGetDetailAccessories = (accessoryId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = {}
            const { rows: accessories } = await pool.query('SELECT * FROM "Accessories" WHERE id=$1', [accessoryId])
            let imageBase64 = '';
            if (accessories[0].image) {
                imageBase64 = Buffer.from(accessories[0].image, 'base64').toString('binary')
            }
            data = {
                ...accessories[0],
                image: imageBase64
            }

            resolve({
                errCode: 0,
                errMessage: 'Get data is success',
                data
            })
        } catch (error) {
            reject(error)
        }
    })
}

const handleCreateNewAccessory = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { category, productName, previewImg, priceNew, accessories_id } = data
            await pool.query(
                'INSERT INTO "Accessories"("category_id", "name", "image", "price_new", "accessories_id") VALUES ($1, $2, $3, $4, $5)',
                [category, productName, previewImg, priceNew, accessories_id]
            );

            resolve({
                errCode: 0,
                errMessage: "Create new accessory is success"
            })


        } catch (error) {
            reject(error)
        }
    })
}

const handleDeleteNewAccessory = (accessoryId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { rows } = await pool.query('SELECT * FROM "Accessories" WHERE id = $1', [accessoryId])
            let accessory = rows[0]
            if (!accessory) {
                resolve({
                    errCode: 2,
                    errMessage: "accessory is not found"
                })
            }
            await pool.query('DELETE FROM "Accessories" WHERE id = $1', [accessoryId])

            resolve({
                errCode: 0,
                errMessage: "Delete succeed!"
            })
        } catch (error) {
            reject(error)
        }
    })
}

const handleUpdateNewAccessory = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let accessoryId = data.id
            if (!accessoryId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameters"
                })
            }
            const { rows } = await pool.query('SELECT * FROM "Accessories" WHERE id = $1', [accessoryId])
            let accessory = rows[0]
            if (!accessory) {
                resolve({
                    errCode: 2,
                    errMessage: "accessory is not found"
                })
            }
            const { category, productName, previewImg, priceNew, accessories_id } = data
            await pool.query('UPDATE "Accessories" SET "category_id"= $1, "name"= $2, "image"=$3, "price_new"=$4, "accessories_id"=$5  where id = $6',
                [category, productName, previewImg, priceNew, accessories_id, accessoryId]
            );
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
    handleGetAllAccessory, handleGetDetailAccessories, handleCreateNewAccessory, handleDeleteNewAccessory, handleUpdateNewAccessory
}