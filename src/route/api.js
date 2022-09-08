import express from "express";
import * as APIcontroler from '../controllers/APIcontroller'
import * as userController from '../controllers/userController'
import * as bicycleController from '../controllers/bicycleController'
import * as accessoryController from '../controllers/accessoryController'
import * as filterController from '../controllers/filterController'
import * as cartController from '../controllers/cartController'
import * as checkoutController from '../controllers/checkoutController'

import * as clientController from '../controllers/clientController'

let router = express.Router();

const initAPIRoute = (app) => {
    router.get('/api/get-data', APIcontroler.getData)
    router.post("/api/login", userController.handleLogin)
    router.get("/api/get-all-code", userController.handleGetAllCode)
    router.get("/api/get-category", userController.handleGetCategory)
    router.get("/api/get-type-allcode", userController.handleGetTypeAllCode)

    router.get("/api/get-all-user", userController.handleGetAllUser)
    router.post("/api/create-new-user", userController.handleCreateNewUser)
    router.put("/api/update-user", userController.handleUpdateNewUser)
    router.delete("/api/delete-user", userController.handleDeleteNewUser)

    router.post("/api/signup-client", clientController.handleSignUpClient)
    router.post("/api/login-client", clientController.handleLogInClient)
    router.put("/api/update-client", clientController.handleUpdateNewClient)
    router.delete("/api/delete-client", clientController.handleDeleteNewClient)

    router.get("/api/get-all-bicycle", bicycleController.handleGetAllBicycle)
    router.post("/api/create-new-bicycle", bicycleController.handleCreateNewBicycle)
    router.put("/api/update-bicycle", bicycleController.handleUpdateNewBicycle)
    router.delete("/api/delete-bicycle", bicycleController.handleDeleteNewBicycle)

    router.get("/api/get-detail-bicycle", bicycleController.handleGetDetailBicycle)
    router.post("/api/create-markdown-bicycle", bicycleController.handleCreateMarkDownBicycle)
    router.post("/api/create-specifications-bicycle", bicycleController.handleCreateSpecificationsBicycle)


    router.get("/api/get-all-accessory", accessoryController.handleGetAllAccessory)
    router.post("/api/create-new-accessory", accessoryController.handleCreateNewAccessory)
    router.put("/api/update-accessory", accessoryController.handleUpdateNewAccessory)
    router.delete("/api/delete-accessory", accessoryController.handleDeleteNewAccessory)

    router.get("/api/get-all-filter", filterController.handleGetAllFilter)
    router.post("/api/create-new-filter", filterController.handleCreateNewFilter)
    router.put("/api/update-filter", filterController.handleUpdateNewFilter)
    router.delete("/api/delete-filter", filterController.handleDeleteNewFilter)

    router.get("/api/get-all-cart", cartController.handleGetAllCart)
    router.post("/api/create-new-cart", cartController.handleCreateNewCart)
    router.put("/api/update-cart", cartController.handleUpdateNewCart)
    router.delete("/api/delete-cart", cartController.handleDeleteNewCart)

    router.get("/api/get-all-checkout", checkoutController.handleGetAllCheckout)
    router.post("/api/create-new-checkout", checkoutController.handleCreateNewCheckout)
    router.post("/api/update-statusId-checkout", checkoutController.handleUpdateStatusIdCheckout)

    return app.use('/', router)
}

export default initAPIRoute