import express from "express";
import { userRouter } from "../app/modules/user/user.route";
import { authRouter } from "../app/modules/auth/auth.router";
import { categoryRouter } from "../app/modules/categorie/categorie.router";
import { technicianRouter } from "../app/modules/technicianProfiles/technicianProfiles.router";

const router = express.Router();

const routers = [
    {
        path: "/user",
        route: userRouter
    },
    {
        path: "/auth",
        route: authRouter
    },
    {
        path: "/admin/categories",
        route: categoryRouter
    },
    {
        path: "/technician",
        route: technicianRouter
    }
]

routers.forEach(r=>{
    router.use(r.path, r.route)
})

export default router;