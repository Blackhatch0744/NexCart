import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
    Elements,
    PaymentElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";
import axios from "axios";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { useCart } from "../context/CartContext";
import API_BASE_URL from "../config";

// Initialize Stripe outside component to avoid recreation
// Initialize Stripe outside component to avoid recreation
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// --- MOCK PAYMENT FORM COMPONENT ---
const MockPaymentForm = ({ orderData, onSuccess }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [formData, setFormData] = useState({
        cardNumber: "",
        expiry: "",
        cvc: "",
        name: "Test User"
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsProcessing(true);

        // Simulate API delay
        setTimeout(async () => {
            // Create Order in Backend
            try {
                const { data } = await axios.post(
                    `${API_BASE_URL}/api/orders`,
                    {
                        ...orderData,
                        paymentInfo: {
                            id: "MOCK_txn_" + Date.now(),
                            status: "succeeded",
                        },
                    },
                    { withCredentials: true }
                );

                if (data.success) {
                    localStorage.setItem("minix-last-order", JSON.stringify(data.order));
                    onSuccess();
                }
            } catch (err) {
                console.error("Mock payment failed", err);
                alert("Mock payment failed");
            } finally {
                setIsProcessing(false);
            }
        }, 2000);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-white/10 p-4 rounded-xl mb-6">
                <p className="text-yellow-400 text-sm font-semibold mb-2">⚡ DEMO MODE ACTIVE</p>
                <p className="text-xs text-gray-400">Stripe keys are missing. Using Simulated Gateway.</p>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm text-gray-400 mb-1">Card Number</label>
                    <div className="relative">
                        <input
                            type="text"
                            name="cardNumber"
                            placeholder="0000 0000 0000 0000"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30"
                            value={formData.cardNumber}
                            onChange={handleChange}
                            required
                        />
                        <div className="absolute right-4 top-3.5 flex gap-2">
                            <div className="w-8 h-5 bg-white/20 rounded"></div>
                            <div className="w-8 h-5 bg-white/20 rounded"></div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Expiry Date</label>
                        <input
                            type="text"
                            name="expiry"
                            placeholder="MM/YY"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30"
                            value={formData.expiry}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">CVC</label>
                        <input
                            type="text"
                            name="cvc"
                            placeholder="123"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30"
                            value={formData.cvc}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm text-gray-400 mb-1">Cardholder Name</label>
                    <input
                        type="text"
                        name="name"
                        placeholder="Name on Card"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>

            <button
                disabled={isProcessing}
                className="w-full mt-6 bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-200 transition-all disabled:opacity-50"
            >
                {isProcessing ? "Processing Payment..." : `Pay $${orderData.totalPrice.toFixed(2)}`}
            </button>
        </form>
    );
};
// --- END MOCK FORM ---


const CheckoutForm = ({ clientSecret, orderData }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const navigate = useNavigate();
    const { clearCart } = useCart();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        setIsProcessing(true);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: window.location.origin + "/order-success",
            },
            redirect: "if_required",
        });

        if (error) {
            setMessage(error.message);
            setIsProcessing(false);
        } else if (paymentIntent && paymentIntent.status === "succeeded") {
            try {
                const { data } = await axios.post(
                    `${API_BASE_URL}/api/orders`,
                    {
                        ...orderData,
                        paymentInfo: {
                            id: paymentIntent.id,
                            status: paymentIntent.status,
                        },
                    },
                    { withCredentials: true }
                );

                if (data.success) {
                    localStorage.setItem("minix-last-order", JSON.stringify(data.order));
                    clearCart();
                    navigate("/order-success");
                }
            } catch (err) {
                const errorMsg = err.response?.data?.message || err.message || "Order creation failed";
                setMessage(`Payment success, but Order failed: ${errorMsg}`);
                console.error("Order Creation Error:", err);
            }
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <PaymentElement id="payment-element" />

            {message && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm">
                    {message}
                </div>
            )}

            <button
                disabled={isProcessing || !stripe || !elements}
                id="submit"
                className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isProcessing ? "Processing..." : "Pay Now"}
            </button>


        </form>
    );
};

export default function Payment() {
    const [clientSecret, setClientSecret] = useState("");
    const [paymentMode, setPaymentMode] = useState("stripe"); // 'stripe' or 'mock'

    const location = useLocation();
    const navigate = useNavigate();
    const { clearCart } = useCart();
    const orderData = location.state?.orderData;

    useEffect(() => {
        if (!orderData) {
            navigate("/cart");
            return;
        }

        // Create PaymentIntent
        const createIntent = async () => {
            try {
                const { data } = await axios.post(
                    `${API_BASE_URL}/api/payments/create-payment-intent`,
                    {
                        items: orderData.items,
                        currency: "usd",
                    },
                    { withCredentials: true }
                );

                if (data.clientSecret) {
                    setClientSecret(data.clientSecret);
                } else {
                    // Fallback or error if no secret
                    console.error("No client secret returned");
                }

            } catch (error) {
                console.error("Failed to init payment", error);
                const msg = error.response?.data?.message || "Found issue connecting to payment gateway";
                alert(msg);
                if (error.response?.status === 400 || error.response?.status === 404) {
                    navigate("/cart"); // Go back if stock issue
                }
            }
        };

        createIntent();
    }, [orderData, navigate]);

    return (
        <div className="min-h-screen bg-black text-white font-inter">
            <Navbar />

            <div className="pt-32 pb-20 px-4 max-w-lg mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-center">Secure Payment</h1>

                <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-xl">
                    <div className="mb-8">
                        <p className="text-gray-400 text-sm mb-1">Total Amount</p>
                        <p className="text-4xl font-bold">${orderData?.totalPrice?.toFixed(2)}</p>
                    </div>

                    {clientSecret ? (
                        <Elements stripe={stripePromise} options={{ clientSecret, theme: 'night', appearance: { theme: 'night', variables: { colorPrimary: '#ffffff', colorBackground: '#1a1a1a', colorText: '#ffffff' } } }}>
                            <CheckoutForm clientSecret={clientSecret} orderData={orderData} />
                        </Elements>
                    ) : (
                        <p className="text-center text-gray-400">Loading Payment Gateway...</p>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
}
