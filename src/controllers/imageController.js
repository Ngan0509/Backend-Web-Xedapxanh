import * as imageService from "../services/imageService"

const handleGetMultiImage = async (req, res) => {
    try {
        let resp = await imageService.handleGetMultiImage(req.query.id, req.query.type)
        return res.status(200).json(resp)
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}

const handleCreateMultiImage = async (req, res) => {
    try {
        let resp = await imageService.handleCreateMultiImage(req.body)
        return res.status(200).json(resp)
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}

const handleDeleteMultiImage = async (req, res) => {
    try {
        let resp = await imageService.handleDeleteMultiImage(req.query.name)
        return res.status(200).json(resp)
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}

export {
    handleGetMultiImage, handleCreateMultiImage, handleDeleteMultiImage

}