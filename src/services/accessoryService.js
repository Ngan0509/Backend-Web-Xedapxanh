import pool from "../configs/connectDB";
import bcrypt from 'bcryptjs';
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

            accessories = accessories.map(accessory => {
                let imageBase64 = ''
                if (accessory.image) {
                    imageBase64 = Buffer.from(accessory.image, 'base64').toString('binary')
                }
                return {
                    ...accessory,
                    image: imageBase64
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
    handleGetAllAccessory, handleCreateNewAccessory, handleDeleteNewAccessory, handleUpdateNewAccessory
}