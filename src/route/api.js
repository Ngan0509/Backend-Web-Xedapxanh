import express from "express";
import * as APIcontroler from '../controllers/APIcontroller'
import * as userController from '../controllers/userController'
import * as bicycleController from '../controllers/bicycleController'
import * as accessoryController from '../controllers/accessoryController'

let router = express.Router();

const initAPIRoute = (app) => {
    router.get('/api/get-data', APIcontroler.getData)
    router.post("/api/login", userController.handleLogin)
    router.get("/api/get-all-code", userController.handleGetAllCode)
    router.get("/api/get-category", userController.handleGetCategory)

    router.get("/api/get-all-user", userController.handleGetAllUser)
    router.post("/api/create-new-user", userController.handleCreateNewUser)
    router.put("/api/update-user", userController.handleUpdateNewUser)
    router.delete("/api/delete-user", userController.handleDeleteNewUser)

    router.get("/api/get-all-bicycle", bicycleController.handleGetAllBicycle)
    router.post("/api/create-new-bicycle", bicycleController.handleCreateNewBicycle)
    router.put("/api/update-bicycle", bicycleController.handleUpdateNewBicycle)
    router.delete("/api/delete-bicycle", bicycleController.handleDeleteNewBicycle)

    router.get("/api/get-all-accessory", accessoryController.handleGetAllAccessory)
    router.post("/api/create-new-accessory", accessoryController.handleCreateNewAccessory)
    router.put("/api/update-accessory", accessoryController.handleUpdateNewAccessory)
    router.delete("/api/delete-accessory", accessoryController.handleDeleteNewAccessory)
    return app.use('/', router)
}

export default initAPIRoute