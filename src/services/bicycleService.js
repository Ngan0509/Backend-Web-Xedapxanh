import pool from "../configs/connectDB";
import bcrypt from 'bcryptjs';
const salt = bcrypt.genSaltSync(10);

const handleGetAllBicycle = (bicycleId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let bicycles = []
            if (bicycleId === "All") {
                const [rows, fields] = await pool.execute('SELECT id, category_id, name, image, price_space_id, brand_id, use_target_id, weel_size_id, frame_material_id, rider_height_id, brake_id, disk_number_id, utilities_id, price_new, price_old, discout FROM bicycle')
                bicycles = rows
            }
            if (bicycleId && bicycleId !== "All") {
                const [bicycle2, b] = await pool.execute('SELECT id, category_id, name, image, price_space_id, brand_id, use_target_id, weel_size_id, frame_material_id, rider_height_id, brake_id, disk_number_id, utilities_id, price_new, price_old, discout FROM bicycle WHERE category_id = ?', [bicycleId])


                const [allcode, c] = await pool.execute('SELECT keyMap, valueEn, valueVi FROM allcode')

                const [categories, d] = await pool.execute('SELECT * FROM categogy')

                let result = bicycle2.map((bicycle) => {
                    let categoryData, priceSpaceData, brandData, useTargetData, weelSizeData, frameMaterialData, riderHeightData, brakeData, diskNumberData, utilitiesData
                    allcode.forEach((item) => {
                        if (item.keyMap === bicycle.price_space_id) {
                            priceSpaceData = {
                                valueEn: item.valueEn,
                                valueVi: item.valueVi
                            }
                        }

                        if (item.keyMap === bicycle.brand_id) {
                            brandData = {
                                valueEn: item.valueEn,
                                valueVi: item.valueVi
                            }
                        }

                        if (item.keyMap === bicycle.use_target_id) {
                            useTargetData = {
                                valueEn: item.valueEn,
                                valueVi: item.valueVi
                            }
                        }

                        if (item.keyMap === bicycle.weel_size_id) {
                            weelSizeData = {
                                valueEn: item.valueEn,
                                valueVi: item.valueVi
                            }
                        }

                        if (item.keyMap === bicycle.frame_material_id) {
                            frameMaterialData = {
                                valueEn: item.valueEn,
                                valueVi: item.valueVi
                            }
                        }

                        if (item.keyMap === bicycle.rider_height_id) {
                            riderHeightData = {
                                valueEn: item.valueEn,
                                valueVi: item.valueVi
                            }
                        }

                        if (item.keyMap === bicycle.brake_id) {
                            brakeData = {
                                valueEn: item.valueEn,
                                valueVi: item.valueVi
                            }
                        }

                        if (item.keyMap === bicycle.disk_number_id) {
                            diskNumberData = {
                                valueEn: item.valueEn,
                                valueVi: item.valueVi
                            }
                        }

                        if (item.keyMap === bicycle.utilities_id) {
                            utilitiesData = {
                                valueEn: item.valueEn,
                                valueVi: item.valueVi
                            }
                        }

                    })

                    categories.forEach((item) => {
                        if (item.id === bicycle.category_id) {
                            categoryData = {
                                valueEn: item.nameEn,
                                valueVi: item.nameVi
                            }
                        }
                    })
                    return {
                        ...bicycle,
                        categoryData,
                        priceSpaceData,
                        brandData,
                        useTargetData,
                        weelSizeData,
                        frameMaterialData,
                        riderHeightData,
                        brakeData,
                        diskNumberData,
                        utilitiesData
                    }
                })

                bicycles = result
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
            const { category, productName, previewImg, priceSpace, brand, useTarget, weelSize, frameMaterial, riderHeight, brake, diskNumber, utilities, priceNew, priceOld, discout } = data
            await pool.execute(
                'INSERT INTO bicycle(category_id, name, image ,price_space_id, brand_id, use_target_id, weel_size_id, frame_material_id, rider_height_id, brake_id, disk_number_id, utilities_id, price_new, price_old, discout) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [category, productName, previewImg, priceSpace, brand, useTarget, weelSize, frameMaterial, riderHeight, brake, diskNumber, utilities, priceNew, priceOld, discout]
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
            const { category, productName, previewImg, priceSpace, brand, useTarget, weelSize, frameMaterial, riderHeight, brake, diskNumber, utilities, priceNew, priceOld, discout } = data
            await pool.execute('UPDATE bicycle SET category_id= ?, name= ?, image=?, price_space_id	=?, brand_id=?, use_target_id=?, weel_size_id=?, frame_material_id=?, rider_height_id=?, brake_id=?, disk_number_id=?, utilities_id=?, price_new=?, price_old=?, discout=? where id = ?',
                [category, productName, previewImg, priceSpace, brand, useTarget, weelSize, frameMaterial, riderHeight, brake, diskNumber, utilities, priceNew, priceOld, discout, bicycleId]
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