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

            const [favorites, c] = await pool.execute('SELECT * FROM favorite')

            const [comments, a] = await pool.execute('SELECT * FROM comment WHERE product_id= ? && type= ?', [product_id, type])

            const [answers, b] = await pool.execute('SELECT * FROM answer')

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
            await pool.execute(
                'INSERT INTO comment(product_id, client_id, type, fullname, date, content, phoneNumber) VALUES (?, ?, ?, ?, ?, ?, ?)',
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
            const [rows, fields] = await pool.execute('SELECT * FROM comment WHERE id = ?', [commentId])
            let comment = rows[0]
            if (!comment) {
                resolve({
                    errCode: 2,
                    errMessage: "comment is not found"
                })
            }
            await pool.execute('DELETE FROM comment WHERE id = ?', [commentId])

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
            const [rows, fields] = await pool.execute('SELECT * FROM comment WHERE id = ?', [commentId])
            let comment = rows[0]
            if (!comment) {
                resolve({
                    errCode: 2,
                    errMessage: "comment is not found"
                })
            }
            const { content, date } = data
            await pool.execute('UPDATE comment SET content= ?, date= ? where id = ?',
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