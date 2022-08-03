import * as bicycleService from "../services/bicycleService"

const handleGetAllBicycle = async (req, res) => {
    try {
        let resp = await bicycleService.handleGetAllBicycle(req.query.id)
        return res.status(200).json(resp)
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}

const handleCreateNewBicycle = async (req, res) => {
    try {
        let resp = await bicycleService.handleCreateNewBicycle(req.body)
        return res.status(200).json(resp)
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}

const handleUpdateNewBicycle = async (req, res) => {
    try {
        let resp = await bicycleService.handleUpdateNewBicycle(req.body)
        return res.status(200).json(resp)
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}

const handleDeleteNewBicycle = async (req, res) => {
    try {
        let resp = await bicycleService.handleDeleteNewBicycle(req.query.id)
        return res.status(200).json(resp)
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}

export {
    handleGetAllBicycle, handleCreateNewBicycle, handleDeleteNewBicycle, handleUpdateNewBicycle
}