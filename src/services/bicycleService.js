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

const handleGetDetailBicycle = (bicycleId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = {}
            const [bicycle, a] = await pool.execute('SELECT id, category_id, name, image, price_new, price_old, discout FROM bicycle WHERE id=?', [bicycleId])
            const [markdown, b] = await pool.execute('SELECT * FROM markdown WHERE bicycleId=?', [bicycleId])

            const [specifications, c] = await pool.execute('SELECT * FROM specifications WHERE bicycleId=?', [bicycleId])

            let markdownData, specificationsData = {}
            const { contentHTML, contentMarkdown } = markdown[0]
            markdownData = {
                contentHTML,
                contentMarkdown
            }

            const tien_ich = []
            specifications.forEach(item => {
                tien_ich.push(item.tien_ich)
            })

            const { chat_lieu_son, do_tuoi, chieu_cao, kich_thuoc_trong_luong,
                tai_trong, tai_trong_yen_phu, thuong_hieu, noi_san_xuat, suon_xe, phuoc, kich_co_banh_xe,
                vanh, lop_xe, loai_van_bom, bo_dia, bo_thang, tay_thang, loai_phanh_thang, bo_lip,
                ghi_dong, chat_lieu_yen, chat_lieu_cot, hang
            } = specifications[0]

            specificationsData = {
                chat_lieu_son, tien_ich, do_tuoi, chieu_cao, kich_thuoc_trong_luong,
                tai_trong, tai_trong_yen_phu, thuong_hieu, noi_san_xuat, suon_xe, phuoc, kich_co_banh_xe,
                vanh, lop_xe, loai_van_bom, bo_dia, bo_thang, tay_thang, loai_phanh_thang, bo_lip,
                ghi_dong, chat_lieu_yen, chat_lieu_cot, hang
            }

            data = { ...bicycle[0], markdownData, specificationsData }
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

const handleCreateMarkDownBicycle = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { bicycleId, contentHTML, contentMarkdown, hasOldData } = data
            if (hasOldData) {
                await pool.execute(
                    'UPDATE markdown SET contentHTML = ?, contentMarkdown = ? where bicycleId = ?',
                    [contentHTML, contentMarkdown, bicycleId]
                );

            } else {
                await pool.execute(
                    'INSERT INTO markdown(bicycleId, contentHTML, contentMarkdown ) VALUES (?, ?, ?)',
                    [bicycleId, contentHTML, contentMarkdown]
                );
            }

            resolve({
                errCode: 0,
                errMessage: "Save markdown is success"
            })


        } catch (error) {
            reject(error)
        }
    })
}

const handleCreateSpecificationsBicycle = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = data.tien_ich.map(item => ({
                ...data,
                tien_ich: item
            }))

            await pool.execute('DELETE FROM specifications WHERE bicycleId = ?', [data.bicycleId])

            result.forEach(async (item) => {
                const { bicycleId, chat_lieu_son, tien_ich, do_tuoi, chieu_cao, kich_thuoc_trong_luong,
                    tai_trong, tai_trong_yen_phu, thuong_hieu, noi_san_xuat, suon_xe, phuoc, kich_co_banh_xe,
                    vanh, lop_xe, loai_van_bom, bo_dia, bo_thang, tay_thang, loai_phanh_thang, bo_lip,
                    ghi_dong, chat_lieu_yen, chat_lieu_cot, hang
                } = item

                await pool.execute(
                    'INSERT INTO specifications(bicycleId, chat_lieu_son, tien_ich, do_tuoi, chieu_cao, kich_thuoc_trong_luong, tai_trong, tai_trong_yen_phu, thuong_hieu, noi_san_xuat, suon_xe, phuoc, kich_co_banh_xe, vanh, lop_xe, loai_van_bom, bo_dia, bo_thang, tay_thang, loai_phanh_thang, bo_lip, ghi_dong, chat_lieu_yen, chat_lieu_cot, hang) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                    [
                        bicycleId, chat_lieu_son, tien_ich, do_tuoi, chieu_cao, kich_thuoc_trong_luong,
                        tai_trong, tai_trong_yen_phu, thuong_hieu, noi_san_xuat, suon_xe, phuoc, kich_co_banh_xe,
                        vanh, lop_xe, loai_van_bom, bo_dia, bo_thang, tay_thang, loai_phanh_thang, bo_lip,
                        ghi_dong, chat_lieu_yen, chat_lieu_cot, hang
                    ]
                );
            })

            resolve({
                errCode: 0,
                errMessage: "Save new specifications is success"
            })


        } catch (error) {
            reject(error)
        }
    })
}

export {
    handleGetAllBicycle, handleGetDetailBicycle, handleCreateNewBicycle, handleDeleteNewBicycle,
    handleUpdateNewBicycle, handleCreateMarkDownBicycle, handleCreateSpecificationsBicycle
}