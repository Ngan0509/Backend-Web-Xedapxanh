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
                const [rows, fields] = await pool.execute('SELECT id, category_id, nameEn, nameVi, type FROM filter')
                filters = rows
            }
            if (filterId && filterId !== "All") {
                const [rows, fields] = await pool.execute('SELECT id, category_id, nameEn, nameVi, type FROM filter WHERE category_id = ?', [filterId])
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
            await pool.execute(
                'INSERT INTO filter(category_id, nameEn, nameVi, type) VALUES (?, ?, ?, ?)',
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
            const [rows, fields] = await pool.execute('SELECT * FROM filter WHERE id = ?', [filterId])
            let filter = rows[0]
            if (!filter) {
                resolve({
                    errCode: 2,
                    errMessage: "filter is not found"
                })
            }
            await pool.execute('DELETE FROM filter WHERE id = ?', [filterId])

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
            const [rows, fields] = await pool.execute('SELECT * FROM filter WHERE id = ?', [filterId])
            let filter = rows[0]
            if (!filter) {
                resolve({
                    errCode: 2,
                    errMessage: "filter is not found"
                })
            }
            const { category, nameEn, nameVi, type } = data
            await pool.execute('UPDATE filter SET category_id= ?, nameEn= ?, nameVi= ?, type= ? where id = ?',
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