import * as filterService from "../services/filterService"

const handleGetAllFilter = async (req, res) => {
    try {
        let resp = await filterService.handleGetAllFilter(req.query.id)
        return res.status(200).json(resp)
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}

const handleCreateNewFilter = async (req, res) => {
    try {
        let resp = await filterService.handleCreateNewFilter(req.body)
        console.log(resp)
        return res.status(200).json(resp)
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}

const handleUpdateNewFilter = async (req, res) => {
    try {
        let resp = await filterService.handleUpdateNewFilter(req.body)
        return res.status(200).json(resp)
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}

const handleDeleteNewFilter = async (req, res) => {
    try {
        let resp = await filterService.handleDeleteNewFilter(req.query.id)
        return res.status(200).json(resp)
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}

export {
    handleCreateNewFilter, handleGetAllFilter, handleUpdateNewFilter, handleDeleteNewFilter

}