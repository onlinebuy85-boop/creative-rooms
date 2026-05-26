import { Router, type IRouter } from "express";
import healthRouter from "./health";
import profilesRouter from "./profiles";
import roomsRouter from "./rooms";
import messagesRouter from "./messages";
import demosRouter from "./demos";
import uploadsRouter from "./uploads";

const router: IRouter = Router();

router.use(healthRouter);
router.use(profilesRouter);
router.use(roomsRouter);
router.use(messagesRouter);
router.use(demosRouter);
router.use(uploadsRouter);

export default router;
