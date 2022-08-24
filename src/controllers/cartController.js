import * as cartService from "../services/cartService"

const handleGetAllCart = async (req, res) => {
    try {
        let resp = await cartService.handleGetAllCart(req.query.id)
        return res.status(200).json(resp)
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}

const handleCreateNewCart = async (req, res) => {
    try {
        let resp = await cartService.handleCreateNewCart(req.body)
        console.log(resp)
        return res.status(200).json(resp)
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}

const handleUpdateNewCart = async (req, res) => {
    try {
        let resp = await cartService.handleUpdateNewCart(req.body)
        return res.status(200).json(resp)
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}

const handleDeleteNewCart = async (req, res) => {
    try {
        let resp = await cartService.handleDeleteNewCart(req.query.id)
        return res.status(200).json(resp)
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}

export {
    handleCreateNewCart, handleGetAllCart, handleUpdateNewCart, handleDeleteNewCart

}