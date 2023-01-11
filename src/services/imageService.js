import pool from "../configs/connectDB";
var Buffer = require('buffer/').Buffer

const handleGetMultiImage = (productId, type) => {
    return new Promise(async (resolve, reject) => {
        try {
            let multiImages = []
            if (!productId || !type) {
                resolve({
                    errCode: 1,
                    errMessage: 'missing parameter'
                })
            }

            const [rows, fields] = await pool.execute('SELECT * FROM product_image WHERE product_id = ? AND type = ?', [productId, type])
            multiImages = rows

            if (multiImages && multiImages.length > 0) {
                multiImages = multiImages.map(multiImage => {
                    let imageBase64 = ''
                    if (multiImage.image) {
                        imageBase64 = Buffer.from(multiImage.image, 'base64').toString('binary')
                    }
                    return {
                        ...multiImage,
                        image: imageBase64
                    }
                })
            }

            resolve({
                errCode: 0,
                errMessage: 'Get data is success',
                data: multiImages
            })
        } catch (error) {
            reject(error)
        }
    })
}

const handleCreateMultiImage = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = data.arrImage.map((item) => {
                return {
                    type: data.type,
                    productId: data.productId,
                    name: item.name,
                    image: item.base64
                }
            })
            result.forEach(async (item) => {
                const { type, productId, name, image } = item
                await pool.execute(
                    'INSERT INTO product_image(type, product_id, name, image) VALUES (?, ?, ?, ?)',
                    [type, productId, name, image]
                );
            })


            resolve({
                errCode: 0,
                errMessage: "Create multi images is success"
            })


        } catch (error) {
            reject(error)
        }
    })
}

const handleDeleteMultiImage = (name) => {
    return new Promise(async (resolve, reject) => {
        try {
            const [rows, fields] = await pool.execute('SELECT * FROM product_image WHERE name = ?', [name])
            let data = rows[0]
            if (!data) {
                resolve({
                    errCode: 2,
                    errMessage: "data is not found"
                })
            }
            await pool.execute('DELETE FROM product_image WHERE name = ?', [name])

            resolve({
                errCode: 0,
                errMessage: "Delete succeed!"
            })
        } catch (error) {
            reject(error)
        }
    })
}

export {
    handleGetMultiImage, handleCreateMultiImage, handleDeleteMultiImage
}