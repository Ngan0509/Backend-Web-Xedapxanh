import * as favoriteService from "../services/favoriteService"

const handleCreateNewFavorite = async (req, res) => {
    try {
        let resp = await favoriteService.handleCreateNewFavorite(req.body)
        return res.status(200).json(resp)
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}

export {
    handleCreateNewFavorite

}