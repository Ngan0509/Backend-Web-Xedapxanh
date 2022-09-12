import * as storeService from "../services/storeService"

const handleGetAllStore = async (req, res) => {
    try {
        let resp = await storeService.handleGetAllStore(req.query.id)
        return res.status(200).json(resp)
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}

const handleCreateNewStore = async (req, res) => {
    try {
        let resp = await storeService.handleCreateNewStore(req.body)
        return res.status(200).json(resp)
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}

const handleUpdateNewStore = async (req, res) => {
    try {
        let resp = await storeService.handleUpdateNewStore(req.body)
        return res.status(200).json(resp)
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}

const handleDeleteNewStore = async (req, res) => {
    try {
        let resp = await storeService.handleDeleteNewStore(req.query.id)
        return res.status(200).json(resp)
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}

export {
    handleCreateNewStore, handleGetAllStore, handleUpdateNewStore, handleDeleteNewStore

}