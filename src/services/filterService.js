import pool from "../configs/connectDB";

const handleGetAllFilter = (filterId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let filters = []
            if (!filterId) {
                resolve({
                    errCode: 1,
                    errMessage: 'missing parameter'
                })
            }
            if (filterId === "All") {
                const { rows } = await pool.query('SELECT "id", "category_id", "nameEn", "nameVi", "type" FROM "Filter"')
                filters = rows
            }
            if (filterId && filterId !== "All") {
                const { rows } = await pool.query('SELECT "id", "category_id", "nameEn", "nameVi", "type" FROM "Filter" WHERE category_id = $1', [filterId])
                filters = rows
            }
            resolve({
                errCode: 0,
                errMessage: 'Get data is success',
                data: filters
            })
        } catch (error) {
            reject(error)
        }
    })
}

const handleCreateNewFilter = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { category, nameEn, nameVi, type } = data
            await pool.query(
                'INSERT INTO "Filter"("category_id", "nameEn", "nameVi", "type") VALUES ($1, $2, $3, $4)',
                [category, nameEn, nameVi, type]
            );

            resolve({
                errCode: 0,
                errMessage: "Create new filter is success"
            })


        } catch (error) {
            reject(error)
        }
    })
}

const handleDeleteNewFilter = (filterId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { rows } = await pool.query('SELECT * FROM "Filter" WHERE id = $1', [filterId])
            let filter = rows[0]
            if (!filter) {
                resolve({
                    errCode: 2,
                    errMessage: "filter is not found"
                })
            }
            await pool.query('DELETE FROM "Filter" WHERE id = $1', [filterId])

            resolve({
                errCode: 0,
                errMessage: "Delete succeed!"
            })
        } catch (error) {
            reject(error)
        }
    })
}

const handleUpdateNewFilter = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let filterId = data.id
            if (!filterId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameters"
                })
            }
            const { rows } = await pool.query('SELECT * FROM "Filter" WHERE id = $1', [filterId])
            let filter = rows[0]
            if (!filter) {
                resolve({
                    errCode: 2,
                    errMessage: "filter is not found"
                })
            }
            const { category, nameEn, nameVi, type } = data
            await pool.query('UPDATE "Filter" SET "category_id"= $1, "nameEn"= $2, "nameVi"= $3, "type"= $4 where id = $5',
                [category, nameEn, nameVi, type, filterId]
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
    handleCreateNewFilter, handleGetAllFilter, handleUpdateNewFilter, handleDeleteNewFilter
}