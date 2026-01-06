import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainContainer from "../container/MainContainer";
import { FaCheckCircle } from "react-icons/fa";

const PaymentSimulationPage = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState("processing"); // processing, success, failed

    useEffect(() => {
        // Simulate payment processing time
        const timer = setTimeout(() => {
            setStatus("success");
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (status === "success") {
            const timer = setTimeout(() => {
                // Redirect back to dashboard or orders page
                // Assuming user role is kept in local storage or redux, but for simplicity generic redirect or back
                navigate(-1); // Or specific path if known
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [status, navigate]);

    return (
        <div className="w-full h-screen bg-gray-50 flex justify-center items-center">
            <MainContainer>
                <div className="max-w-md w-full mx-auto bg-white p-8 rounded-2xl shadow-xl text-center">
                    {status === "processing" && (
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
                            <h2 className="text-2xl font-bold text-gray-800">
                                Processing Payment...
                            </h2>
                            <p className="text-gray-500">
                                Please wait while we securely process your transaction.
                            </p>
                            <div className="w-full bg-gray-100 h-2 rounded-full mt-4 overflow-hidden">
                                <div className="h-full bg-green-500 animate-pulse w-2/3"></div>
                            </div>
                        </div>
                    )}

                    {status === "success" && (
                        <div className="flex flex-col items-center gap-4 animate-fade-in-up">
                            <FaCheckCircle className="w-20 h-20 text-green-500" />
                            <h2 className="text-3xl font-bold text-gray-800">
                                Payment Successful!
                            </h2>
                            <p className="text-gray-500">
                                Your order has been placed successfully. Redirecting you back...
                            </p>
                        </div>
                    )}
                </div>
            </MainContainer>
        </div>
    );
};

export default PaymentSimulationPage;
