import pool from "../configs/connectDB";
import bcrypt from 'bcryptjs';
const salt = bcrypt.genSaltSync(10);

const getHomePage = async (req, res) => {

    const [rows, fields] = await pool.execute('SELECT * FROM admin');
    return res.render('index.ejs', { dataUser: rows })
}

const getDetailPage = async (req, res) => {
    const userId = req.params.id
    const [rows, fields] = await pool.execute('SELECT * FROM admin where `id` = ?', [userId])
    return res.send(JSON.stringify(rows[0]))
}

const createNewUser = async (req, res) => {
    let { name, email, password, phoneNumber } = req.body;

    let hashPassword = await hashUserPassword(password)

    await pool.execute('INSERT INTO admin (name, email, password, roleId, phoneNumber) VALUES (?, ?, ?, ?, ?)', [name, email, hashPassword, 'R1', phoneNumber])

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

    await pool.execute('DELETE FROM admin WHERE id = ?', [userId])

    return res.redirect('/')
}

const getEditPage = async (req, res) => {
    let userId = req.params.id
    const [rows, fields] = await pool.execute('SELECT * FROM admin where `id` = ?', [userId])
    return res.render('updateUser', { dataUser: rows[0] })
}

const postUpdateUser = async (req, res) => {
    let { name, email, phoneNumber, id } = req.body;

    await pool.execute('UPDATE admin SET name = ?, email = ?, phoneNumber = ? WHERE id = ?',
        [name, email, phoneNumber, id])

    return res.redirect('/')
}

export { getHomePage, getDetailPage, createNewUser, deleteUser, getEditPage, postUpdateUser }