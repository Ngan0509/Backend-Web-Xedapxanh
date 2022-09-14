import pool from "../configs/connectDB";
var Buffer = require('buffer/').Buffer

const handleGetAllStore = (storeId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let stores = []
            if (!storeId) {
                resolve({
                    errCode: 1,
                    errMessage: 'missing parameter'
                })
            }
            if (storeId === "All") {
                const [rows, fields] = await pool.execute('SELECT * FROM storesys')
                stores = rows
            }
            if (storeId && storeId !== "All") {
                const [rows, fields] = await pool.execute('SELECT * FROM storesys WHERE id = ?', [storeId])
                stores = rows
            }

            if (stores && stores.length > 0) {
                stores = stores.map(store => {
                    let imageBase64 = ''
                    if (store.image) {
                        imageBase64 = Buffer.from(store.image, 'base64').toString('binary')
                    }
                    return {
                        ...store,
                        image: imageBase64
                    }
                })
            }
            resolve({
                errCode: 0,
                errMessage: 'Get data is success',
                data: stores
            })
        } catch (error) {
            reject(error)
        }
    })
}

const handleCreateNewStore = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { name, image, address, phoneNumber } = data
            await pool.execute(
                'INSERT INTO storesys(name, image, address, phoneNumber) VALUES (?, ?, ?, ?)',
                [name, image, address, phoneNumber]
            );

            resolve({
                errCode: 0,
                errMessage: "Create new store is success"
            })


        } catch (error) {
            reject(error)
        }
    })
}

const handleDeleteNewStore = (storeId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const [rows, fields] = await pool.execute('SELECT * FROM storesys WHERE id = ?', [storeId])
            let store = rows[0]
            if (!store) {
                resolve({
                    errCode: 2,
                    errMessage: "store is not found"
                })
            }
            await pool.execute('DELETE FROM storesys WHERE id = ?', [storeId])

            resolve({
                errCode: 0,
                errMessage: "Delete succeed!"
            })
        } catch (error) {
            reject(error)
        }
    })
}

const handleUpdateNewStore = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let storeId = data.id
            if (!storeId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameters"
                })
            }
            const [rows, fields] = await pool.execute('SELECT * FROM storesys WHERE id = ?', [storeId])
            let store = rows[0]
            if (!store) {
                resolve({
                    errCode: 2,
                    errMessage: "store is not found"
                })
            }
            const { name, image, address, phoneNumber } = data
            await pool.execute('UPDATE storesys SET name= ?, image= ?, address= ?, phoneNumber= ? where id = ?',
                [name, image, address, phoneNumber, storeId]
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
    handleCreateNewStore, handleGetAllStore, handleUpdateNewStore, handleDeleteNewStore
}