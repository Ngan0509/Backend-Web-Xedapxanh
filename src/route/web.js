import express from "express";
import * as homeController from "../controllers/homeController"

let router = express.Router();

const initWebRoute = (app) => {
    router.get('/', homeController.getHomePage)
    router.get('/detail/user/:id', homeController.getDetailPage)
    router.post('/create-new-user', homeController.createNewUser)
    router.post('/delete-user', homeController.deleteUser)
    router.get('/edit-user/:id', homeController.getEditPage);
    router.post('/update-user', homeController.postUpdateUser)
    router.get('/about', (req, res) => {
        res.send('About is here...')
    })

    return app.use('/', router)
}

export default initWebRoute