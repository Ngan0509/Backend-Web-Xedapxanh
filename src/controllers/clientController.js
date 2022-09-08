import * as clientService from "../services/clientService"
const handleLogInClient = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(500).json({
            errCode: 1,
            errMessage: "Mising inputs parameter"
        })
    }
    let userData = await clientService.handleLogInClient(email, password)
    return res.status(200).json({
        ...userData
    })
}

const handleSignUpClient = async (req, res) => {
    try {
        let resp = await clientService.handleSignUpClient(req.body)
        return res.status(200).json(resp)
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}

const handleUpdateNewClient = async (req, res) => {
    try {
        let resp = await clientService.handleUpdateNewClient(req.body)
        return res.status(200).json(resp)
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}

const handleDeleteNewClient = async (req, res) => {
    try {
        let resp = await clientService.handleDeleteNewClient(req.query.id)
        return res.status(200).json(resp)
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}

export {
    handleLogInClient,
    handleSignUpClient,
    handleUpdateNewClient,
    handleDeleteNewClient
}