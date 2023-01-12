import pool from "../configs/connectDB";
import moment from "moment";

const handleGetAllComment = (product_id, type) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!product_id || !type) {
                resolve({
                    errCode: 1,
                    errMessage: 'missing parameter'
                })
            }

            const { rows: favorites } = await pool.query('SELECT * FROM "Favorite"')

            const { rows: comments } = await pool.query('SELECT * FROM "Comment" WHERE product_id= $1 AND type= $2', [product_id, type])

            const { rows: answers } = await pool.query('SELECT * FROM "Answer"')

            let result = []
            if (comments.length > 0) {
                result = comments.map((comment) => {
                    let answerArr = []
                    if (answers.length > 0) {
                        answers.forEach(answer => {
                            if (answer.comment_id === comment.id) {
                                answerArr.push(answer)
                            }
                        })
                    }
                    let num_star = 0
                    if (favorites.length > 0) {
                        favorites.forEach(favorite => {
                            if (favorite.product_id === comment.product_id && favorite.client_id === comment.client_id) {
                                num_star = favorite.num_star
                            }
                        })
                    }
                    return {
                        ...comment,
                        answerArr,
                        date: moment(new Date(Number(comment.date))).format('DD/MM/YYYY'),
                        num_star
                    }
                })
            }

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

const handleCreateNewComment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { product_id, client_id, type, fullname, date, content, phoneNumber } = data
            await pool.query(
                'INSERT INTO "Comment"("product_id", "client_id", "type", "fullname", "date", "content", "phoneNumber") VALUES ($1, $2, $3, $4, $5, $6, $7)',
                [product_id, client_id, type, fullname, date, content, phoneNumber]
            );

            resolve({
                errCode: 0,
                errMessage: "Create new comment is success"
            })


        } catch (error) {
            reject(error)
        }
    })
}

const handleDeleteNewComment = (commentId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { rows } = await pool.query('SELECT * FROM "Comment" WHERE id = $1', [commentId])
            let comment = rows[0]
            if (!comment) {
                resolve({
                    errCode: 2,
                    errMessage: "comment is not found"
                })
            }
            await pool.query('DELETE FROM "Comment" WHERE id = $1', [commentId])

            resolve({
                errCode: 0,
                errMessage: "Delete succeed!"
            })
        } catch (error) {
            reject(error)
        }
    })
}

const handleUpdateNewComment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let commentId = data.id
            if (!commentId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameters"
                })
            }
            const { rows } = await pool.query('SELECT * FROM "Comment" WHERE id = $1', [commentId])
            let comment = rows[0]
            if (!comment) {
                resolve({
                    errCode: 2,
                    errMessage: "comment is not found"
                })
            }
            const { content, date } = data
            await pool.query('UPDATE "Comment" SET "content"= $1, "date"= $2 where id = $3',
                [content, date, commentId]
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
    handleCreateNewComment, handleGetAllComment, handleUpdateNewComment, handleDeleteNewComment
}