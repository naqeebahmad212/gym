const { addPackage, getPackagesByFilter, subscribePackage, updatePackages, getActivePackage, countCreatePkg } = require("../controller/Packages.controller.js");
const { upload } = require("../middleware/multer.js");
const { verifyToken } = require("../utils/varifyToken.js");
const Router = require("express").Router();

Router.post("/addPackage", addPackage);
Router.get("/getPackages", getPackagesByFilter);
Router.get("/getActivePackage",verifyToken, getActivePackage);
Router.post("/subscribePackage",verifyToken, subscribePackage);
Router.delete("/updatePackages",verifyToken, updatePackages);
Router.put("/updatePackages",verifyToken, updatePackages);
Router.get("/countCreatePkg/:id",verifyToken, countCreatePkg);

module.exports = Router;