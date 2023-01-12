import pool from "../configs/connectDB";
import bcrypt from 'bcryptjs';
const salt = bcrypt.genSaltSync(10);


const handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {}
            let isExist = await checkUserEmail(email)
            if (isExist) {
                let { rows } = await pool.query('SELECT * FROM "Admin" WHERE email = $1', [email])
                let user = rows[0]
                if (user) {
                    let checkPass = bcrypt.compareSync(password, user.password)
                    if (checkPass) {
                        userData = {
                            errCode: 0,
                            errMessage: "Ok",
                            user: {
                                id: user.id,
                                email: user.email,
                                roleId: user.roleId,
                                fullname: user.name,
                                city_id: user.city_id,
                                district_id: user.district_id
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
            let { rows } = await pool.query('SELECT * FROM "Admin" WHERE email = $1', [userEmail])
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
            if (typeInput === 'ROLE' || typeInput === 'GENDER' || typeInput === 'PROVINCE' || typeInput === 'DELIVERY' || typeInput === 'PAYMENT') {
                let { rows } = await pool.query('SELECT * FROM "Allcodeuser" WHERE type = $1', [typeInput])
                data = rows
            } else {
                let { rows } = await pool.query('SELECT * FROM "Allcode" WHERE type = $1', [typeInput])
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

            let { rows } = await pool.query('SELECT DISTINCT "type" FROM "Allcode"')
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
                const { rows } = await pool.query('SELECT * FROM "Categogy" WHERE type = $1', [inputType])
                data = rows
            } else if (inputType === 'ACCESSORIES') {
                const { rows } = await pool.query('SELECT * FROM "Categogy" WHERE type = $1', [inputType])
                data = rows
            } else {
                const { rows } = await pool.query('SELECT * FROM "Categogy"')
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
                const { rows } = await pool.query('SELECT "id", "name", "email", "phoneNumber", "roleId", "genderId", "city_id", "district_id" FROM "Admin"')
                users = rows
            }
            if (userId && userId !== "All") {
                const { rows } = await pool.query('SELECT "id", "name", "email", "phoneNumber", "roleId", "genderId", "city_id", "district_id" FROM "Admin" WHERE id = $1', [userId])
                users = rows
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
                await pool.query(
                    'INSERT INTO "Admin"("name", "email", "password" , "phoneNumber", "roleId", "genderId", "city_id", "district_id") VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
                    [data.fullname, data.email, hashPasswordFromBcrypt, data.phoneNumber, data.role, data.gender, data.city_id, data.district_id]
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
            const { rows } = await pool.query('SELECT * FROM "Admin" WHERE id = $1', [userId])
            let user = rows[0]
            if (!user) {
                resolve({
                    errCode: 2,
                    errMessage: "user is not found"
                })
            }
            await pool.query('DELETE FROM "Admin" WHERE id = $1', [userId])

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
            const { rows } = await pool.query('SELECT * FROM "Admin" WHERE id = $1', [userId])
            let user = rows[0]
            if (!user) {
                resolve({
                    errCode: 2,
                    errMessage: "User is not found"
                })
            }
            await pool.query('UPDATE "Admin" SET "name"= $1, "phoneNumber"= $2, "genderId"= $3, "roleId"= $4, "city_id"= $5, "district_id"= $6 where id = $7',
                [data.fullname, data.phoneNumber, data.gender, data.role, data.city_id, data.district_id, data.id]
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