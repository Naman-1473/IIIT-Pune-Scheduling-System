import {Router} from "express";
import {setinstructor} from "../controllers/instructor.controller.js";
import {verifyJWT} from '../middlewares/auth.middleware.js'
import {getInstructors} from "../controllers/get.controllers.js";
import {updateInstructors} from "../controllers/update.controllers.js";
import {deleteInstructors} from "../controllers/delete.contollers.js";

const router = Router()

router.route( "/setdata" ).put( verifyJWT, setinstructor )
router.route( "/getinstructors" ).get( verifyJWT, getInstructors )
router.route("/updateinstructor").patch(verifyJWT,updateInstructors)
router.route("/deleteinstructor").delete(verifyJWT,deleteInstructors)

export default router