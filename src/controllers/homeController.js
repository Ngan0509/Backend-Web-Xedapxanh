import pool from "../configs/connectDB";
import bcrypt from 'bcryptjs';
const salt = bcrypt.genSaltSync(10);

const getHomePage = async (req, res) => {

    const { rows } = await pool.query('SELECT * FROM "Admin"');
    return res.render('index.ejs', { dataUser: rows })
}

const getDetailPage = async (req, res) => {
    const userId = req.params.id
    const { rows } = await pool.query('SELECT * FROM "Admin" where id = $1', [userId])
    return res.send(JSON.stringify(rows[0]))
}

const createNewUser = async (req, res) => {
    let { name, email, password, phoneNumber } = req.body;

    let hashPassword = await hashUserPassword(password)

    await pool.query('INSERT INTO "Admin" ("name", "email", "password", "roleId", "phoneNumber") VALUES ($1, $2, $3, $4, $5)', [name, email, hashPassword, 'R1', phoneNumber])

    return res.redirect('/')
}

const hashUserPassword = (password) => {
    return new Promise((resolve, reject) => {
        try {
            let hashPassword = bcrypt.hashSync(password, salt);
            resolve(hashPassword)
        } catch (error) {
            reject(error)
        }
    })
}

const deleteUser = async (req, res) => {
    let userId = req.body.userId

    await pool.query('DELETE FROM "Admin" WHERE id = $1', [userId])

    return res.redirect('/')
}

const getEditPage = async (req, res) => {
    let userId = req.params.id
    const { rows } = await pool.query('SELECT * FROM "Admin" WHERE id = $1', [userId])
    return res.render('updateUser', { dataUser: rows[0] })
}

const postUpdateUser = async (req, res) => {
    let { name, email, phoneNumber, id } = req.body;

    await pool.query('UPDATE "Admin" SET "name" = $1, "email" = $2, "phoneNumber" = $3 WHERE id = $4',
        [name, email, phoneNumber, id])

    return res.redirect('/')
}

export { getHomePage, getDetailPage, createNewUser, deleteUser, getEditPage, postUpdateUser }