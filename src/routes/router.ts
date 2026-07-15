import express from "express";
import { userRouter } from "../app/modules/user/user.route";
import { authRouter } from "../app/modules/auth/auth.router";
import { categoryRouter } from "../app/modules/categorie/categorie.router";
import { technicianRouter } from "../app/modules/technicianProfiles/technicianProfiles.router";
import { serviceRouter } from "../app/modules/service/service.router";
import { technicianTimeSlotRouter } from "../app/modules/technicianTimeSlot/technicianTimeSlot.router";
import { bookingRouter } from "../app/modules/booking/booking.router";
import { paymentRouter } from "../app/modules/payment/payment.route";
import { reviewRouter } from "../app/modules/review/review.router";

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
        path: "/categories",
        route: categoryRouter
    },
    {
        path: "/technician",
        route: technicianRouter
    },
    {
        path: "/services",
        route: serviceRouter
    },
    {
        path: "/technician-time-slot",
        route: technicianTimeSlotRouter
    },
    {
        path: "/booking",
        route: bookingRouter
    },
    {
        path: "/payment",
        route: paymentRouter
    },
    {
        path: "/reviews",
        route: reviewRouter
    }
]

routers.forEach(r=>{
    router.use(r.path, r.route)
})

export default router;