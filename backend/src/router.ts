import { Router } from "express";
import { CreateUserController } from "./controllers/user/CreateUserController";
import { DetailUserController } from "./controllers/user/DetailUserController";

const router = Router();

router.post("/users", new CreateUserController().handle);
router.get("/profile/:id", new DetailUserController().handle);

export { router };
