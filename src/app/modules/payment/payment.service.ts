import { config } from "../../../../config";
import { prisma } from "../../../../lib/prisma"
import stripe from "../../../../lib/stripe";
import { AppError } from "../../../middlewares/appError";

const createPayment = async (email: string, paymentData: any) => {
    const user = await prisma.user.findUnique({
        where: {
            email: email
        }
    })

    if (!user) {
        throw new AppError(404, "User not found");
    }

    const booking = await prisma.bookings.findUnique({
        where: {
            id: paymentData.bookingId
        },
        include: {
            service: true
        }
    })

    if (!booking) {
        throw new AppError(404, "Booking not found");
    }

    if (booking.customerId !== user.id) {
        throw new AppError(403, "You are not authorized to make payment for this booking");
    }

    const existingPayment = await prisma.payments.findUnique({
        where: {
            bookingId: booking.id
        }
    })

    if (existingPayment) {
        throw new AppError(400, "Payment already exists for this booking");
    }

    try {
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price_data: {
                        currency: "BDT",
                        product_data: {
                            name: `Payment for ${booking.service.name}`,
                            description: `Secure payment for ${booking.service.name}. Booking Ref: #${booking.id.slice(-6).toUpperCase()} ${booking.createdAt ? `| Date: ${booking.createdAt.toLocaleDateString()}` : ''}`,
                            images: [booking.service.image_url as string]
                        },
                        unit_amount: booking.totalAmount * 100,
                    },
                    quantity: 1
                }
            ],
            mode: "payment",
            payment_method_types: ["card"],
            metadata: {
                bookingId: booking.id
            },
            customer_email: user.email,
            success_url: `${config.node_env==="development" ? config.client_local_url : config.client_prod_url}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${config.node_env==="development" ? config.client_local_url : config.client_prod_url}/payment-cancel`,
        })
        await prisma.payments.create({
            data: {
                bookingId: booking.id,
                transactionId: session.id,
                amount: booking.totalAmount
            }
        })
        return session.url;
    } catch (error) {
        console.log(error);
        throw new Error(error?.message);
    }
}

export const paymentService = {
    createPayment
}