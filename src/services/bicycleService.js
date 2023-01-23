import pool from "../configs/connectDB";
import bcrypt from 'bcryptjs';
var Buffer = require('buffer/').Buffer

const salt = bcrypt.genSaltSync(10);

const handleGetAllBicycle = (bicycleId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let bicycles = []
            if (bicycleId === "All") {
                const { rows } = await pool.query('SELECT "id", "category_id", "name", "image", "price_space_id", "brand_id", "use_target_id", "weel_size_id", "frame_material_id", "rider_height_id", "brake_id", "disk_number_id", "utilities_id", "price_new", "price_old", "discout" FROM "Bicycle"')
                bicycles = rows.reverse();
            }
            if (bicycleId && bicycleId !== "All") {
                const { rows } = await pool.query('SELECT "id", "category_id", "name", "image", "price_space_id", "brand_id", "use_target_id", "weel_size_id", "frame_material_id", "rider_height_id", "brake_id", "disk_number_id", "utilities_id", "price_new", "price_old", "discout" FROM "Bicycle" WHERE category_id = $1', [bicycleId])
                bicycles = rows.reverse();
            }
            const { rows: allcode } = await pool.query('SELECT "keyMap", "valueEn", "valueVi" FROM "Allcode"')

            const { rows: categories } = await pool.query('SELECT * FROM "Categogy"')

            const { rows: favorites } = await pool.query('SELECT * FROM "Favorite"')

            let result = bicycles.map((bicycle) => {
                let imageBase64 = ''
                if (bicycle.image) {
                    imageBase64 = Buffer.from(bicycle.image, 'base64').toString('binary')
                }
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

                let favoriteArr = []
                if (favorites.length > 0) {
                    favorites.forEach((item) => {
                        if (item.product_id === bicycle.id) {
                            favoriteArr.push(item.num_star)
                        }
                    })
                }

                let num_star_avg = 0
                if (favoriteArr.length > 0) {
                    let sum = favoriteArr.reduce((a, b) => a + b)

                    num_star_avg = Math.round(sum / favoriteArr.length)
                }
                return {
                    ...bicycle,
                    num_star_avg,
                    image: imageBase64,
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

const handleGetDetailBicycle = (bicycleId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = {}
            const { rows: bicycle } = await pool.query('SELECT "id", "category_id", "name", "image", "price_new", "price_old", "discout" FROM "Bicycle" WHERE id=$1', [bicycleId])

            const { rows: markdown } = await pool.query('SELECT * FROM "Markdown" WHERE "bicycleId"=$1', [bicycleId])

            const { rows: specifications } = await pool.query('SELECT * FROM "Specifications" WHERE "bicycleId"=$1', [bicycleId])

            let markdownData = {}, specificationsData = {}


            if (markdown.length > 0) {
                const { contentHTML, contentMarkdown } = markdown[0]
                markdownData = {
                    contentHTML,
                    contentMarkdown
                }
            }

            if (specifications.length > 0) {
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
            }

            let imageBase64 = '';
            if (bicycle[0].image) {
                imageBase64 = Buffer.from(bicycle[0].image, 'base64').toString('binary')
            }
            data = { ...bicycle[0], image: imageBase64, markdownData, specificationsData }
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
            await pool.query(
                'INSERT INTO "Bicycle"("category_id", "name", "image" ,"price_space_id", "brand_id", "use_target_id", "weel_size_id", "frame_material_id", "rider_height_id", "brake_id", "disk_number_id", "utilities_id", "price_new", "price_old", "discout") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)',
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
            const { rows } = await pool.query('SELECT * FROM "Bicycle" WHERE id = $1', [bicycleId])
            let bicycle = rows[0]
            if (!bicycle) {
                resolve({
                    errCode: 2,
                    errMessage: "bicycle is not found"
                })
            }
            await pool.query('DELETE FROM "Bicycle" WHERE id = $1', [bicycleId])

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
            const { rows } = await pool.query('SELECT * FROM "Bicycle" WHERE id = $1', [bicycleId])
            let bicycle = rows[0]
            if (!bicycle) {
                resolve({
                    errCode: 2,
                    errMessage: "bicycle is not found"
                })
            }
            const { category, productName, previewImg, priceSpace, brand, useTarget, weelSize, frameMaterial, riderHeight, brake, diskNumber, utilities, priceNew, priceOld, discout } = data
            await pool.query('UPDATE "Bicycle" SET "category_id"= $1, "name"= $2, "image"=$3, "price_space_id"=$4, "brand_id"=$5, "use_target_id"=$6, "weel_size_id"=$7, "frame_material_id"=$8, "rider_height_id"=$9, "brake_id"=$10, "disk_number_id"=$11, "utilities_id"=$12, "price_new"=$13, "price_old"=$14, "discout"=$15 where id = $16',
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
                await pool.query(
                    'UPDATE "Markdown" SET "contentHTML" = $1, "contentMarkdown" = $2 where "bicycleId" = $3',
                    [contentHTML, contentMarkdown, bicycleId]
                );

            } else {
                await pool.query(
                    'INSERT INTO "Markdown"("bicycleId", "contentHTML", "contentMarkdown" ) VALUES ($1, $2, $3)',
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

            await pool.query('DELETE FROM "Specifications" WHERE "bicycleId" = $1', [data.bicycleId])

            result.forEach(async (item) => {
                const { bicycleId, chat_lieu_son, tien_ich, do_tuoi, chieu_cao, kich_thuoc_trong_luong,
                    tai_trong, tai_trong_yen_phu, thuong_hieu, noi_san_xuat, suon_xe, phuoc, kich_co_banh_xe,
                    vanh, lop_xe, loai_van_bom, bo_dia, bo_thang, tay_thang, loai_phanh_thang, bo_lip,
                    ghi_dong, chat_lieu_yen, chat_lieu_cot, hang
                } = item

                await pool.query(
                    'INSERT INTO "Specifications"("bicycleId", "chat_lieu_son", "tien_ich", "do_tuoi", "chieu_cao", "kich_thuoc_trong_luong", "tai_trong", "tai_trong_yen_phu", "thuong_hieu", "noi_san_xuat", "suon_xe", "phuoc", "kich_co_banh_xe", "vanh", "lop_xe", "loai_van_bom", "bo_dia", "bo_thang", "tay_thang", "loai_phanh_thang", "bo_lip", "ghi_dong", "chat_lieu_yen", "chat_lieu_cot", "hang") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25)',
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