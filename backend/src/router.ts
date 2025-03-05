import { Router } from "express";

import multer from "multer";
import uploadConfigExcel from "./config/MulterExcel";

import { CreateUserController } from "./controllers/user/CreateUserController";
import { DetailUserController } from "./controllers/user/DetailUserController";
import { AuthUserController } from "./controllers/user/AuthUserController";
import { isAuthtenticated } from "./middlewares/isAuthtenticated";
import { UploadExcelController } from "./controllers/excel/UploadExcelController";
import { SendMessageIaExcelController } from "./controllers/ia/SendMessageIaExcelController";

const router = Router();
const uploadExcel = multer(uploadConfigExcel.upload("./tmp/excel"));

router.post("/users", new CreateUserController().handle);
router.get("/profile/:id", isAuthtenticated, new DetailUserController().handle);
router.post("/session", new AuthUserController().handle);

router.post(
  "/excel/upload",
  isAuthtenticated,
  uploadExcel.single("fileExcel"),
  new UploadExcelController().handle
);
router.post(
  "/excel/send",
  isAuthtenticated,
  new SendMessageIaExcelController().handle
);

export { router };
