"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
export default function DashboardPage() {
    const router = useRouter();
    const [foods, setFoods] = useState([]);
    const [orders, setOrders] = useState([]);
    const [dues, setDues] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedItems, setSelectedItems] = useState({});
    const [placingOrder, setPlacingOrder] = useState(false);
    const [activeTab, setActiveTab] = useState("menu"); // 'menu' or 'orders'

    const API_BASE = "http://127.0.0.1:8000/api";

    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

    const fetchWithAuth = async (url) => {
        const res = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        if (!res.ok) throw new Error(`Failed to fetch ${url}`);
        return res.json();
    };

    const loadData = async () => {
        if (!token) {
            setLoading(false);
            return;
        }
        try {
            const [foodsData, ordersData, duesData] = await Promise.all([
                fetchWithAuth(`${API_BASE}/foods/`),
                fetchWithAuth(`${API_BASE}/orders/`),
                fetchWithAuth(`${API_BASE}/student-dues/`),
            ]);
            setFoods(foodsData);
            setOrders(ordersData);
            setDues(duesData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleQuantityChange = (foodId, qty) => {
        setSelectedItems((prev) => ({
            ...prev,
            [foodId]: { ...prev[foodId], quantity: qty },
        }));
    };

    const toggleSelectFood = (food) => {
        setSelectedItems((prev) => {
            if (prev[food.id]) {
                const updated = { ...prev };
                delete updated[food.id];
                return updated;
            }
            return { ...prev, [food.id]: { ...food, quantity: 1 } };
        });
    };

    const placeOrder = async () => {
        if (Object.keys(selectedItems).length === 0) {
            alert("Please select at least one food item.");
            return;
        }
        setPlacingOrder(true);
        try {
            for (const item of Object.values(selectedItems)) {
                await fetch(`${API_BASE}/orders/`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ food_id: item.id, quantity: item.quantity }),
                });
            }
            alert("Orders placed successfully!");
            setSelectedItems({});
            await loadData();
            setActiveTab("orders");
        } catch (err) {
            alert(err.message);
        } finally {
            setPlacingOrder(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        window.location.reload();
    };

    const calculateTotal = () => {
        return Object.values(selectedItems).reduce(
            (total, item) => total + item.price * item.quantity,
            0
        );
    };

    if (loading)
        return (
            <div className="min-h-screen flexd items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
                <div className="text-center">
                    <div className="w-16 h-16 border-t-4 border-green-500 border-solid rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading delicious options...</p>
                </div>
            </div>
        );

    if (!token) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50">
                <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full mx-4">
                    <div className="text-center">
                        <div className="flex items-center text-3xl md:text-4xl font-bold space-x-3 justify-center">
                            <div className="bg-indigo-600 w-10 h-10 rounded-lg flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                                </svg>
                            </div>
                            <span className="text-xl font-bold text-indigo-900" >
                                <div className=" font-bold text-xl py-2 px-4 rounded-lg cursor-pointer"
                                    onClick={() => router.push("/")} >CanteenPro</div></span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                            Campus Canteen Delights

                        </h1>


                        <p className="text-gray-600 mb-8">
                            Order your favorite meals with just a few clicks
                        </p>

                        {/* <div className="flex justify-center mb-8">
                            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-full" />
                            </div>
                        </div> */}

                        <div className="space-y-4">
                            <a
                                href="/login"
                                className="block bg-gradient-to-r from-green-500 to-green-600 text-white font-medium py-3 px-6 rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                            >
                                Login to Order
                            </a>
                            <a
                                href="/register"
                                className="block bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium py-3 px-6 rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                            >
                                Create Account
                            </a>
                        </div>

                        <p className="mt-8 text-sm text-gray-500">
                            Join 1000+ students enjoying our delicious meals daily
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className=" text-black min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center">
                        <div
                            className="bg-gradient-to-r from-green-500 to-blue-600 text-white font-bold text-xl py-2 px-4 rounded-lg cursor-pointer"
                            onClick={() => router.push("/")}
                        >
                            CanteenPro
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="bg-gradient-to-r from-amber-100 to-yellow-100 px-4 py-2 rounded-lg border border-amber-200">
                            <p className="text-xs text-amber-800">Your due</p>
                            <p className="text-lg font-bold text-amber-900">Rs. {dues?.due_amount ?? 0}</p>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="bg-gradient-to-r from-gray-700 to-gray-800 text-white px-4 py-2 rounded-lg hover:shadow-md transition-shadow"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Menu Section */}
                    <div className="lg:w-2/3">
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                            {/* Navigation Tabs */}
                            <div className="border-b border-gray-200">
                                <nav className="flex">
                                    <button
                                        onClick={() => setActiveTab("menu")}
                                        className={`py-4 px-6 font-medium text-lg ${activeTab === "menu"
                                            ? "text-green-600 border-b-2 border-green-600"
                                            : "text-gray-500 hover:text-gray-700"
                                            }`}
                                    >
                                        Menu
                                    </button>
                                    <button
                                        onClick={() => setActiveTab("orders")}
                                        className={`py-4 px-6 font-medium text-lg ${activeTab === "orders"
                                            ? "text-green-600 border-b-2 border-green-600"
                                            : "text-gray-500 hover:text-gray-700"
                                            }`}
                                    >
                                        My Orders
                                    </button>
                                </nav>
                            </div>

                            {/* Menu Content */}
                            {activeTab === "menu" && (
                                <div className="p-6">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-6">
                                        Today's Specials
                                    </h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {foods.map((food) => (
                                            <div
                                                key={food.id}
                                                className={`border rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl ${selectedItems[food.id]
                                                    ? "border-green-500 bg-green-50 ring-2 ring-green-100"
                                                    : "border-gray-200 hover:border-green-300"
                                                    }`}
                                                onClick={() => toggleSelectFood(food)}
                                            >
                                                <div className="relative">
                                                    {food.image ? (
                                                        <img
                                                            src={food.image}
                                                            alt={food.name}
                                                            className="w-full h-48 object-cover"
                                                        />
                                                    ) : (
                                                        <div className="bg-gray-200 border-2 border-dashed rounded-t-xl w-full h-48" />
                                                    )}

                                                    <div className="absolute top-4 right-4 bg-green-500 text-white font-bold py-1 px-3 rounded-lg">
                                                        Rs. {food.price}
                                                    </div>
                                                </div>

                                                <div className="p-4">
                                                    <h3 className="font-bold text-lg text-gray-800 mb-2">{food.name}</h3>
                                                    <p className="text-gray-600 text-sm mb-4">
                                                        {food.description || "Delicious meal prepared with fresh ingredients"}
                                                    </p>


                                                    {selectedItems[food.id] && (
                                                        <div className="mt-4 flex items-center justify-between">
                                                            <div className="text-sm font-medium text-green-700">
                                                                Selected
                                                            </div>
                                                            <div className="flex items-center">
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleQuantityChange(
                                                                            food.id,
                                                                            Math.max(1, selectedItems[food.id].quantity - 1)
                                                                        );
                                                                    }}
                                                                    className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center"
                                                                >
                                                                    -
                                                                </button>
                                                                <input
                                                                    type="number"
                                                                    min="1"
                                                                    value={selectedItems[food.id]?.quantity || 1}
                                                                    onChange={(e) => handleQuantityChange(food.id, parseInt(e.target.value))}
                                                                    onClick={(e) => e.stopPropagation()}
                                                                    className="mx-2 w-12 text-center border border-gray-300 rounded py-1"
                                                                />
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleQuantityChange(
                                                                            food.id,
                                                                            selectedItems[food.id].quantity + 1
                                                                        );
                                                                    }}
                                                                    className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center"
                                                                >
                                                                    +
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Orders Content */}
                            {activeTab === "orders" && (
                                <div className="p-6">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Order History</h2>

                                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Item
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Quantity
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Price
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Date
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Status
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {orders.map((order) => (
                                                    <tr key={order.id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                {order.food?.image ? (
                                                                    <img
                                                                        className="w-10 h-10 rounded-full object-cover mr-4"
                                                                        src={order.food.image}
                                                                        alt={order.food.name}
                                                                    />
                                                                ) : (
                                                                    <div className="w-10 h-10 rounded-full bg-gray-200 mr-4" />
                                                                )}
                                                                <div>
                                                                    <div className="font-medium text-gray-900">
                                                                        {order.food?.name || "N/A"}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-gray-900">{order.quantity}</div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-gray-900 font-medium">
                                                                Rs. {order.total_price}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                                            {new Date(order.ordered_at).toLocaleDateString()}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            {order.cleared ? (
                                                                <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                                    Cleared
                                                                </span>
                                                            ) : (
                                                                <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                                                    Pending
                                                                </span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {orders.length === 0 && (
                                        <div className="text-center py-12">
                                            <div className="text-gray-400 mb-4">No orders yet</div>
                                            <button
                                                onClick={() => setActiveTab("menu")}
                                                className="bg-gradient-to-r from-green-500 to-green-600 text-white font-medium py-2 px-6 rounded-full shadow hover:shadow-md"
                                            >
                                                Order Now
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:w-1/3">
                        <div className="bg-white rounded-2xl shadow-lg sticky top-8 overflow-hidden">
                            <div className="bg-gradient-to-r from-green-500 to-green-600 p-6">
                                <h2 className="text-xl font-bold text-white">Your Order</h2>
                            </div>

                            <div className="p-6">
                                {Object.values(selectedItems).length === 0 ? (
                                    <div className="text-center py-8">
                                        <div className="text-gray-400 mb-4">Your cart is empty</div>
                                        <p className="text-gray-600 text-sm">
                                            Select delicious items from our menu to get started
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="max-h-96 overflow-y-auto">
                                            {Object.values(selectedItems).map((item) => (
                                                <div key={item.id} className="flex items-center py-3 border-b border-gray-100">
                                                    <div className="flex-shrink-0 mr-4">
                                                        {item.image ? (
                                                            <img
                                                                src={item.image}
                                                                alt={item.name}
                                                                className="w-16 h-16 object-cover rounded-lg"
                                                            />
                                                        ) : (
                                                            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="font-medium text-gray-800">{item.name}</div>
                                                        <div className="text-gray-600 text-sm">
                                                            Rs. {item.price} × {item.quantity}
                                                        </div>
                                                    </div>
                                                    <div className="font-medium text-gray-800">
                                                        Rs. {item.price * item.quantity}
                                                    </div>
                                                    <button
                                                        onClick={() => toggleSelectFood(item)}
                                                        className="ml-4 text-red-500 hover:text-red-700"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-6 pt-4 border-t border-gray-200">
                                            <div className="flex justify-between mb-2">
                                                <span className="text-gray-600">Subtotal</span>
                                                <span className="font-medium">Rs. {calculateTotal()}</span>
                                            </div>
                                            {/* <div className="flex justify-between mb-4">
                                                <span className="text-gray-600">Tax (5%)</span>
                                                <span className="font-medium">Rs. {(calculateTotal() * 0.05).toFixed(2)}</span>
                                            </div> */}
                                            {/* <div className="flex justify-between text-lg font-bold">
                                                <span>Total</span>
                                                <span>Rs. {(calculateTotal() * 1.05).toFixed(2)}</span>
                                            </div> */}
                                        </div>

                                        <button
                                            onClick={placeOrder}
                                            disabled={placingOrder}
                                            className="mt-6 w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                                        >
                                            {placingOrder ? (
                                                <>
                                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Processing...
                                                </>
                                            ) : (
                                                "Place Order Now"
                                            )}
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Promotions */}
                        <div className="mt-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-lg overflow-hidden">
                            <div className="p-6">
                                <h3 className="text-lg font-bold text-white mb-2">Special Offer!</h3>
                                <p className="text-blue-100 mb-4">
                                    Order 3 meals today and get a free dessert on your next order.
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="text-yellow-300 text-sm">Limited time only</span>
                                    <span className="bg-white text-blue-600 text-xs font-bold py-1 px-3 rounded-full">
                                        NEW
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-8">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="mb-4 md:mb-0">
                            <div className="text-xl font-bold">Campus CanteenPro</div>
                            <p className="text-gray-400 mt-2">Delicious meals, made with care</p>
                        </div>

                        <div className="flex space-x-6">
                            <a href="#" className="text-gray-400 hover:text-white">
                                <span className="sr-only">Facebook</span>
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                                </svg>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white">
                                <span className="sr-only">Instagram</span>
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    <div className="mt-8 border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
                        <p>© {new Date().getFullYear()} CampusCanteen. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}