import pool from "../configs/connectDB";

const getData = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const { rows } = await pool.query('SELECT * FROM "Admin"')
            resolve({
                errCode: 0,
                errMessage: 'Ok',
                data: rows
            })
        } catch (error) {
            reject(error)
        }
    })
}

export {
    getData
}