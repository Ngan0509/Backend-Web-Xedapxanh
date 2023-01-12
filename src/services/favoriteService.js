import pool from "../configs/connectDB";

const handleCreateNewFavorite = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { product_id, client_id, num_star } = data
            const { rows: favorites } = await pool.query('SELECT * FROM "Favorite" WHERE product_id = $1 AND client_id = $2', [product_id, client_id])

            if (!favorites[0]) {
                await pool.query(
                    'INSERT INTO "Favorite"("product_id", "client_id", "num_star") VALUES ($1, $2, $3)',
                    [product_id, client_id, num_star]
                );
            } else {
                await pool.query('UPDATE "Favorite" SET "num_star"= $1 WHERE product_id = $2 AND client_id = $3',
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