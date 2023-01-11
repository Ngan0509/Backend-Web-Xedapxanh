import pool from "../configs/connectDB";
import bcrypt from 'bcryptjs';
var Buffer = require('buffer/').Buffer
const salt = bcrypt.genSaltSync(10);

const handleGetAllAccessory = (accessoryId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let accessories = ""
            if (accessoryId === "All") {
                const [rows, fields] = await pool.execute('SELECT id, category_id, name, image, price_new, accessories_id FROM accessories')
                accessories = rows
            }
            if (accessoryId && accessoryId !== "All") {
                const [rows, fields] = await pool.execute('SELECT id, category_id, name, image, price_new, accessories_id FROM accessories WHERE category_id = ?', [accessoryId])
                accessories = rows
            }

            const [categories, d] = await pool.execute('SELECT * FROM categogy')


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
            const [accessories, a] = await pool.execute('SELECT * FROM accessories WHERE id=?', [accessoryId])
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
            await pool.execute(
                'INSERT INTO accessories(category_id, name, image, price_new, accessories_id) VALUES (?, ?, ?, ?, ?)',
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
            const [rows, fields] = await pool.execute('SELECT * FROM accessories WHERE id = ?', [accessoryId])
            let accessory = rows[0]
            if (!accessory) {
                resolve({
                    errCode: 2,
                    errMessage: "accessory is not found"
                })
            }
            await pool.execute('DELETE FROM accessories WHERE id = ?', [accessoryId])

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
            const [rows, fields] = await pool.execute('SELECT * FROM accessories WHERE id = ?', [accessoryId])
            let accessory = rows[0]
            if (!accessory) {
                resolve({
                    errCode: 2,
                    errMessage: "accessory is not found"
                })
            }
            const { category, productName, previewImg, priceNew, accessories_id } = data
            await pool.execute('UPDATE accessories SET category_id= ?, name= ?, image=?, price_new=?, accessories_id=?  where id = ?',
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