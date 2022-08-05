import pool from "../configs/connectDB";
import bcrypt from 'bcryptjs';
const salt = bcrypt.genSaltSync(10);


const handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {}
            let isExist = await checkUserEmail(email)
            if (isExist) {
                let [rows, fields] = await pool.execute('SELECT * FROM admin WHERE email = ?', [email])
                let user = rows[0]
                if (user) {
                    let checkPass = bcrypt.compareSync(password, user.password)
                    if (checkPass) {
                        console.log(user)
                        userData = {
                            errCode: 0,
                            errMessage: "Ok",
                            user: {
                                id: user.id,
                                email: user.email,
                                roleId: user.roleId,
                                fullname: user.name
                            }
                        }
                    } else {
                        userData = {
                            errCode: 3,
                            errMessage: "Wrong password",
                        }
                    }
                } else {
                    userData = {
                        errCode: 2,
                        errMessage: "User is not found!"
                    }
                }
            } else {
                userData = {
                    errCode: 4,
                    errMessage: "Your email is not exist in our system, please try other email"
                }
            }
            resolve(userData)
        } catch (error) {
            reject(error)
        }
    })
}

const checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let [rows, fields] = await pool.execute('SELECT * FROM admin WHERE email = ?', [userEmail])
            let user = rows[0]
            if (user) {
                resolve(true)
            } else {
                resolve(false)
            }
        } catch (error) {
            reject(error)
        }
    })
}

const getAllCode = (typeInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!typeInput) {
                resolve({
                    errCode: 1,
                    errMessage: "Mising requied parameters",
                    data: []
                })
            }

            let data = []
            if (typeInput === 'ROLE' || typeInput === 'GENDER' || typeInput === 'PROVINCE') {
                let [rows, fields] = await pool.execute('SELECT * FROM allcodeuser WHERE type = ?', [typeInput])
                data = rows
            } else {
                let [rows, fields] = await pool.execute('SELECT * FROM allcode WHERE type = ?', [typeInput])
                data = rows
            }
            resolve({
                errCode: 0,
                errMessage: `Get all code of ${typeInput} succeed!`,
                data: data
            })
        } catch (error) {
            reject(error)
        }
    })
}

const handleGetTypeAllCode = () => {
    return new Promise(async (resolve, reject) => {
        try {

            let [rows, fields] = await pool.execute('SELECT DISTINCT type FROM allcode')
            let data = rows

            resolve({
                errCode: 0,
                errMessage: `Get type all code succeed!`,
                data: data
            })
        } catch (error) {
            reject(error)
        }
    })
}



const handleGetCategory = (inputType) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data
            if (inputType === 'BICYCLE') {
                const [rows, fields] = await pool.execute('SELECT * FROM categogy WHERE type = ?', [inputType])
                data = rows
            } else if (inputType === 'ACCESSORIES') {
                const [rows, fields] = await pool.execute('SELECT * FROM categogy WHERE type = ?', [inputType])
                data = rows
            } else {
                const [rows, fields] = await pool.execute('SELECT * FROM categogy')
                data = rows
            }
            resolve({
                errCode: 0,
                errMessage: 'Ok',
                data
            })
        } catch (error) {
            reject(error)
        }
    })
}

const handleGetAllUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = ""
            if (userId === "All") {
                const [rows, fields] = await pool.execute('SELECT id, name, email, phoneNumber, roleId, genderId FROM admin')
                users = rows
            }
            if (userId && userId !== "All") {
                const [rows, fields] = await pool.execute('SELECT id, name, email, phoneNumber, roleId, genderId FROM admin WHERE id = ?', [userId])
                users = rows[0]
            }
            resolve({
                errCode: 0,
                errMessage: 'Get data is success',
                data: users
            })
        } catch (error) {
            reject(error)
        }
    })
}

const handleCreateNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let isExist = await checkUserEmail(data.email)
            if (isExist) {
                resolve({
                    errCode: 1,
                    errMessage: "your email is exist, please try other email"
                })
            } else {
                let hashPasswordFromBcrypt = await hashUserPassword(data.password)
                await pool.execute(
                    'INSERT INTO admin(name, email, password ,phoneNumber, roleId, genderId) VALUES (?, ?, ?, ?, ?, ?)',
                    [data.fullname, data.email, hashPasswordFromBcrypt, data.phoneNumber, data.role, data.gender]
                );

                resolve({
                    errCode: 0,
                    errMessage: "Create new user is success"
                })
            }


        } catch (error) {
            reject(error)
        }
    })
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

const handleDeleteNewUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const [rows, fields] = await pool.execute('SELECT * FROM admin WHERE id = ?', [userId])
            let user = rows[0]
            if (!user) {
                resolve({
                    errCode: 2,
                    errMessage: "user is not found"
                })
            }
            await pool.execute('DELETE FROM admin WHERE id = ?', [userId])

            resolve({
                errCode: 0,
                errMessage: "Delete succeed!"
            })
        } catch (error) {
            reject(error)
        }
    })
}

const handleUpdateNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userId = data.id
            if (!userId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameters"
                })
            }
            const [rows, fields] = await pool.execute('SELECT * FROM admin WHERE id = ?', [userId])
            let user = rows[0]
            if (!user) {
                resolve({
                    errCode: 2,
                    errMessage: "User is not found"
                })
            }
            await pool.execute('UPDATE admin SET name= ?, phoneNumber= ?, genderId=?, roleId=? where id = ?',
                [data.fullname, data.phoneNumber, data.gender, data.role, data.id]
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
    handleUserLogin, getAllCode, handleGetCategory, handleGetAllUser,
    handleCreateNewUser, handleDeleteNewUser, handleUpdateNewUser, handleGetTypeAllCode
}