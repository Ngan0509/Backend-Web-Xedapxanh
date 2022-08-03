import pool from "../configs/connectDB";
import bcrypt from 'bcryptjs';
const salt = bcrypt.genSaltSync(10);

const handleGetAllBicycle = (bicycleId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let bicycles = ""
            if (bicycleId === "All") {
                const [rows, fields] = await pool.execute('SELECT id, name, price_new, price_old, discout FROM bicycle')
                bicycles = rows
            }
            if (bicycleId && bicycleId !== "All") {
                const [rows, fields] = await pool.execute('SELECT id, name, price_new, price_old, discout FROM bicycle WHERE category_id = ?', [bicycleId])
                bicycles = rows
            }
            resolve({
                errCode: 0,
                errMessage: 'Get data is success',
                data: bicycles
            })
        } catch (error) {
            reject(error)
        }
    })
}

const handleCreateNewBicycle = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { category, productName, previewImg, priceSpace, brand, useTarget, weelSize, frameMaterial, riderHeight, brake, priceNew, priceOld, discout } = data
            await pool.execute(
                'INSERT INTO bicycle(category_id, name, image ,price_space_id, brand_id, use_target_id, weel_size_id, frame_material_id, rider_height_id, brake_id, price_new, price_old, discout) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [category, productName, previewImg, priceSpace, brand, useTarget, weelSize, frameMaterial, riderHeight, brake, priceNew, priceOld, discout]
            );

            resolve({
                errCode: 0,
                errMessage: "Create new bicycle is success"
            })


        } catch (error) {
            reject(error)
        }
    })
}

const handleDeleteNewBicycle = (bicycleId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const [rows, fields] = await pool.execute('SELECT * FROM bicycle WHERE id = ?', [bicycleId])
            let bicycle = rows[0]
            if (!bicycle) {
                resolve({
                    errCode: 2,
                    errMessage: "bicycle is not found"
                })
            }
            await pool.execute('DELETE FROM bicycle WHERE id = ?', [bicycleId])

            resolve({
                errCode: 0,
                errMessage: "Delete succeed!"
            })
        } catch (error) {
            reject(error)
        }
    })
}

const handleUpdateNewBicycle = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let bicycleId = data.id
            if (!bicycleId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameters"
                })
            }
            const [rows, fields] = await pool.execute('SELECT * FROM bicycle WHERE id = ?', [bicycleId])
            let bicycle = rows[0]
            if (!bicycle) {
                resolve({
                    errCode: 2,
                    errMessage: "bicycle is not found"
                })
            }
            const { category, productName, previewImg, priceSpace, brand, useTarget, weelSize, frameMaterial, riderHeight, brake, priceNew, priceOld, discout } = data
            await pool.execute('UPDATE bicycle SET category_id= ?, name= ?, image=?, price_space_id	=?, brand_id=?, use_target_id=?, weel_size_id=?, frame_material_id=?, rider_height_id=?, brake_id=?, price_new=?, price_old=?, discout=? where id = ?',
                [category, productName, previewImg, priceSpace, brand, useTarget, weelSize, frameMaterial, riderHeight, brake, priceNew, priceOld, discout, bicycleId]
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
    handleGetAllBicycle, handleCreateNewBicycle, handleDeleteNewBicycle, handleUpdateNewBicycle
}