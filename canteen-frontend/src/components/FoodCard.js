export default function FoodCard({ food, onOrder }) {
    return (
        <div className="bg-white shadow-lg rounded-xl p-4 flex flex-col items-center">
            {food.image && (
                <img
                    src={food.image}
                    alt={food.name}
                    className="w-32 h-32 object-cover rounded-lg mb-3"
                />
            )}
            <h2 className="text-lg font-bold">{food.name}</h2>
            <p className="text-gray-600 text-sm">{food.description}</p>
            <p className="text-green-600 font-semibold">Rs. {food.price}</p>
            <button
                className="bg-blue-500 text-white px-4 py-2 mt-2 rounded hover:bg-blue-600"
                onClick={() => onOrder(food.id)}
            >
                Order
            </button>
        </div>
    );
}
