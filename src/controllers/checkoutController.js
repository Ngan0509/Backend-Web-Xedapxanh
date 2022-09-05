import * as checkoutService from "../services/checkoutService"

const handleGetAllCheckout = async (req, res) => {
    try {
        let resp = await checkoutService.handleGetAllCheckout(req.query.id, req.query.role)
        return res.status(200).json(resp)
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}

const handleCreateNewCheckout = async (req, res) => {
    try {
        let resp = await checkoutService.handleCreateNewCheckout(req.body)
        console.log(resp)
        return res.status(200).json(resp)
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}

const handleUpdateStatusIdCheckout = async (req, res) => {
    try {
        let resp = await checkoutService.handleUpdateStatusIdCheckout(req.body)
        console.log(resp)
        return res.status(200).json(resp)
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}

export {
    handleCreateNewCheckout, handleGetAllCheckout, handleUpdateStatusIdCheckout

}