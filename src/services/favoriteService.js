import pool from "../configs/connectDB";

const handleCreateNewFavorite = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { product_id, client_id, num_star } = data
            const [favorites, fields] = await pool.execute('SELECT * FROM favorite WHERE product_id = ? && client_id = ?', [product_id, client_id])

            if (!favorites[0]) {
                await pool.execute(
                    'INSERT INTO favorite(product_id, client_id, num_star) VALUES (?, ?, ?)',
                    [product_id, client_id, num_star]
                );
            } else {
                await pool.execute('UPDATE favorite SET num_star= ? WHERE product_id = ? && client_id = ?',
                    [num_star, product_id, client_id]
                );
            }

            resolve({
                errCode: 0,
                errMessage: "Create new favorite is success"
            })


        } catch (error) {
            reject(error)
        }
    })
}

export {
    handleCreateNewFavorite
}