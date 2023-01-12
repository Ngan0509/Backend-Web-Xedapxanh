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
                const { rows } = await pool.query('SELECT * FROM "Storesys"')
                stores = rows
            }
            if (storeId && storeId !== "All") {
                const { rows } = await pool.query('SELECT * FROM "Storesys" WHERE id = $1', [storeId])
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
            await pool.query(
                'INSERT INTO "Storesys"("name", "image", "address", "phoneNumber") VALUES ($1, $2, $3, $4)',
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
            const { rows } = await pool.query('SELECT * FROM "Storesys" WHERE id = $1', [storeId])
            let store = rows[0]
            if (!store) {
                resolve({
                    errCode: 2,
                    errMessage: "store is not found"
                })
            }
            await pool.query('DELETE FROM "Storesys" WHERE id = $1', [storeId])

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
            const { rows } = await pool.query('SELECT * FROM "Storesys" WHERE id = $1', [storeId])
            let store = rows[0]
            if (!store) {
                resolve({
                    errCode: 2,
                    errMessage: "store is not found"
                })
            }
            const { name, image, address, phoneNumber } = data
            await pool.query('UPDATE "Storesys" SET "name"= $1, "image"= $2, "address"= $3, "phoneNumber"= $4 where id = $5',
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