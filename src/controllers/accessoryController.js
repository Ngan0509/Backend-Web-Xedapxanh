import * as accessoryService from "../services/accessoryService"

const handleGetAllAccessory = async (req, res) => {
    try {
        let resp = await accessoryService.handleGetAllAccessory(req.query.id)
        return res.status(200).json(resp)
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}

const handleGetDetailAccessories = async (req, res) => {
    try {
        let resp = await accessoryService.handleGetDetailAccessories(req.query.id)
        return res.status(200).json(resp)
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}

const handleCreateNewAccessory = async (req, res) => {
    try {
        let resp = await accessoryService.handleCreateNewAccessory(req.body)
        return res.status(200).json(resp)
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}

const handleUpdateNewAccessory = async (req, res) => {
    try {
        let resp = await accessoryService.handleUpdateNewAccessory(req.body)
        return res.status(200).json(resp)
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}

const handleDeleteNewAccessory = async (req, res) => {
    try {
        let resp = await accessoryService.handleDeleteNewAccessory(req.query.id)
        return res.status(200).json(resp)
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}

export {
    handleGetAllAccessory, handleGetDetailAccessories, handleCreateNewAccessory, handleDeleteNewAccessory, handleUpdateNewAccessory
}