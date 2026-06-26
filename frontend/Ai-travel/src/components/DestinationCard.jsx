import { FaMapMarkerAlt, FaStar } from "react-icons/fa";

const DestinationCard = ({
    image,
    name,
    country,
    rating,
    price,
}) => {
    return (
        <div className="group overflow-hidden rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl hover:border-blue-500/40 transition duration-300">

            <div className="overflow-hidden">
                <img
                    src={image}
                    alt={name}
                    className="h-60 w-full object-cover group-hover:scale-110 transition duration-500"
                />
            </div>

            <div className="p-6">

                <div className="flex justify-between items-center">

                    <h2 className="text-2xl font-bold">
                        {name}
                    </h2>

                    <div className="flex items-center gap-1 text-yellow-400">
                        <FaStar />
                        {rating}
                    </div>

                </div>

                <div className="mt-2 flex items-center gap-2 text-gray-400">
                    <FaMapMarkerAlt />
                    {country}
                </div>

                <div className="mt-6 flex justify-between items-center">

                    <div>
                        <p className="text-gray-400 text-sm">
                            Starting From
                        </p>

                        <h3 className="text-blue-400 text-xl font-bold">
                            ₹{price}
                        </h3>
                    </div>

                    <button className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-3 font-semibold hover:scale-105 transition">
                        Explore
                    </button>

                </div>

            </div>

        </div>
    );
};

export default DestinationCard;