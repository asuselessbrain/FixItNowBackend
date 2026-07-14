import Stripe from "stripe";
import { config } from "../../../../config";
import { prisma } from "../../../../lib/prisma"
import stripe from "../../../../lib/stripe";
import { AppError } from "../../../middlewares/appError";
import { BookingStatus, PaymentStatus } from "../../../../prisma/generated/prisma/enums";

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

    if (booking.status !== "CONFIRMED") {
        throw new AppError(400, "Payment can only be made for confirmed bookings");
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
            payment_intent_data: {
                metadata: {
                    bookingId: booking.id
                }
            },
            metadata: {
                bookingId: booking.id
            },
            customer_email: user.email,
            success_url: `${config.node_env === "development" ? config.client_local_url : config.client_prod_url}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${config.node_env === "development" ? config.client_local_url : config.client_prod_url}/payment-cancel`,
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

        const message = error instanceof Error ? error.message : "An error occurred while creating the payment session";
        console.log(error);
        throw new Error(message);
    }
}

const handleWebhook = async (payload: Buffer, signature: string) => {
    const endpointSecret = config.payment.stripe_webhook_secret as string;

    const event = Stripe.webhooks.constructEvent(
        payload,
        signature,
        endpointSecret
    );

    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object as Stripe.PaymentIntent;

            const bookingId = paymentIntent.metadata.bookingId;

            const payment = await prisma.payments.findUnique({
                where: {
                    bookingId: bookingId
                }
            })

            if (!payment) {
                throw new AppError(404, "Payment not found");
            }

            await prisma.$transaction(async (tx) => {
                await tx.payments.update({
                    where: {
                        bookingId: bookingId
                    },
                    data: {
                        status: PaymentStatus.SUCCESS,
                        transactionId: paymentIntent.id
                    }
                })

                await tx.bookings.update({
                    where: {
                        id: bookingId
                    },
                    data: {
                        status: BookingStatus.PAID
                    }
                })
            })
            console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
            // Then define and call a method to handle the successful payment intent.
            // handlePaymentIntentSucceeded(paymentIntent);
            break;
        case 'payment_intent.payment_failed':
            const paymentMethod = event.data.object as Stripe.PaymentIntent;

            const failedBookingId = paymentMethod.metadata.bookingId;

            const failedPayment = await prisma.payments.findUnique({
                where: {
                    bookingId: failedBookingId
                }
            })
            if (!failedPayment) {
                throw new AppError(404, "Payment not found");
            }

            await prisma.payments.update({
                where: {
                    bookingId: failedBookingId
                },
                data: {
                    status: PaymentStatus.FAILED,
                    transactionId: paymentMethod.id
                }
            })
            break;

        case 'checkout.session.expired':
            const expiredSession = event.data.object as Stripe.Checkout.Session;

            const expiredBookingId = expiredSession.metadata?.bookingId;

            const expiredPayment = await prisma.payments.findUnique({
                where: {
                    bookingId: expiredBookingId
                }
            })

            if (!expiredPayment) {
                throw new AppError(404, "Payment not found");
            }

            await prisma.payments.update({
                where: {
                    bookingId: expiredBookingId
                },
                data: {
                    status: PaymentStatus.FAILED,
                    transactionId: expiredSession.id
                }
            })
            break;
        default:
            // Unexpected event type
            console.log(`Unhandled event type ${event.type}.`);
    }

}

export const paymentService = {
    createPayment,
    handleWebhook
}