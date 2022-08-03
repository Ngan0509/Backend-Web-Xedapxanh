import * as userService from "../services/userService"
const handleLogin = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(500).json({
            errCode: 1,
            errMessage: "Mising inputs parameter"
        })
    }
    let userData = await userService.handleUserLogin(email, password)
    return res.status(200).json({
        ...userData
    })
}

const handleGetAllUser = async (req, res) => {
    try {
        let resp = await userService.handleGetAllUser(req.query.id)
        return res.status(200).json(resp)
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}

const handleCreateNewUser = async (req, res) => {
    try {
        let resp = await userService.handleCreateNewUser(req.body)
        return res.status(200).json(resp)
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}

const handleUpdateNewUser = async (req, res) => {
    try {
        let resp = await userService.handleUpdateNewUser(req.body)
        console.log(resp)
        return res.status(200).json(resp)
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}

const handleDeleteNewUser = async (req, res) => {
    try {
        let resp = await userService.handleDeleteNewUser(req.query.id)
        return res.status(200).json(resp)
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}

const handleGetAllCode = async (req, res) => {
    try {
        let data = await userService.getAllCode(req.query.type)
        return res.status(200).json(data)
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}

const handleGetCategory = async (req, res) => {
    try {
        let data = await userService.handleGetCategory()
        return res.status(200).json(data)
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}

export {
    handleLogin, handleGetAllCode, handleGetCategory, handleGetAllUser,
    handleCreateNewUser, handleDeleteNewUser, handleUpdateNewUser
}