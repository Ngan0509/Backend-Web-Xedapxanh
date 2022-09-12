import * as commentService from "../services/commentService"

const handleGetAllComment = async (req, res) => {
    try {
        let resp = await commentService.handleGetAllComment(req.query.product_id, req.query.type)
        return res.status(200).json(resp)
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}

const handleCreateNewComment = async (req, res) => {
    try {
        let resp = await commentService.handleCreateNewComment(req.body)
        console.log(resp)
        return res.status(200).json(resp)
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}

const handleUpdateNewComment = async (req, res) => {
    try {
        let resp = await commentService.handleUpdateNewComment(req.body)
        return res.status(200).json(resp)
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}

const handleDeleteNewComment = async (req, res) => {
    try {
        let resp = await commentService.handleDeleteNewComment(req.query.id)
        return res.status(200).json(resp)
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}

export {
    handleCreateNewComment, handleGetAllComment, handleUpdateNewComment, handleDeleteNewComment

}