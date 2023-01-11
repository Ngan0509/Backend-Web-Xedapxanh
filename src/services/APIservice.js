import pool from "../configs/connectDB";

const getData = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const [rows, fields] = await pool.execute('SELECT * FROM admin')
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