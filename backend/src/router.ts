import { Router } from "express";
import { CreateUserController } from "./controllers/user/CreateUserController";
import { DetailUserController } from "./controllers/user/DetailUserController";
import { AuthUserController } from "./controllers/user/AuthUserController";

const router = Router();

router.post("/users", new CreateUserController().handle);
router.get("/profile/:id", new DetailUserController().handle);
router.post("/session", new AuthUserController().handle);

export { router };
