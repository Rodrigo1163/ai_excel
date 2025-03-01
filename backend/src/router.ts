import { Router } from "express";
import { CreateUserController } from "./controllers/user/CreateUserController";
import { DetailUserController } from "./controllers/user/DetailUserController";
import { AuthUserController } from "./controllers/user/AuthUserController";
import { isAuthtenticated } from "./middlewares/isAuthtenticated";

const router = Router();

router.post("/users", isAuthtenticated, new CreateUserController().handle);
router.get("/profile/:id", isAuthtenticated, new DetailUserController().handle);
router.post("/session", new AuthUserController().handle);

export { router };
