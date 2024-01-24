import { Router } from "express";
import { getUsers, signup } from "./user.controller";

const router = Router()

router.get('/', getUsers)
router.post('/register', signup)

export default router;