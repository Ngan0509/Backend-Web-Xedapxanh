import pool from "../configs/connectDB";

const handleGetAllCart = (cartId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let carts = []
            if (!cartId) {
                resolve({
                    errCode: 1,
                    errMessage: 'missing parameter'
                })
            }
            if (cartId === "All") {
                const [rows, fields] = await pool.execute('SELECT * FROM cart')
                carts = rows
            }

            const [bicycles, fields] = await pool.execute('SELECT id, name, image, price_new, price_old FROM bicycle')

            let result = carts.map((item) => {
                let productData = {}
                if (item.type === 'BICYCLE') {
                    bicycles.forEach(bicycle => {
                        if (bicycle.id === item.product_id) {
                            productData = {
                                name: bicycle.name,
                                image: bicycle.image,
                                price_new: bicycle.price_new,
                                price_old: bicycle.price_old,
                            }
                        }
                    })
                }
                return {
                    ...item,
                    productData
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

const handleCreateNewCart = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { product_id, type, so_luong, price, sum_price } = data
            await pool.execute(
                'INSERT INTO cart(product_id, type, so_luong, price, sum_price) VALUES (?, ?, ?, ?, ?)',
                [product_id, type, so_luong, price, sum_price]
            );

            resolve({
                errCode: 0,
                errMessage: "Create new cart is success"
            })


        } catch (error) {
            reject(error)
        }
    })
}

const handleDeleteNewCart = (cartId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const [rows, fields] = await pool.execute('SELECT * FROM cart WHERE id = ?', [cartId])
            let cart = rows[0]
            if (!cart) {
                resolve({
                    errCode: 2,
                    errMessage: "cart is not found"
                })
            }
            await pool.execute('DELETE FROM cart WHERE id = ?', [cartId])

            resolve({
                errCode: 0,
                errMessage: "Delete succeed!"
            })
        } catch (error) {
            reject(error)
        }
    })
}

const handleUpdateNewCart = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let cartId = data.id
            if (!cartId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameters"
                })
            }
            const [rows, fields] = await pool.execute('SELECT * FROM cart WHERE id = ?', [cartId])
            let cart = rows[0]
            if (!cart) {
                resolve({
                    errCode: 2,
                    errMessage: "cart is not found"
                })
            }
            const { so_luong, sum_price } = data
            await pool.execute('UPDATE cart SET so_luong= ?, sum_price= ? where id = ?',
                [so_luong, sum_price, cartId]
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
    handleCreateNewCart, handleGetAllCart, handleUpdateNewCart, handleDeleteNewCart
}