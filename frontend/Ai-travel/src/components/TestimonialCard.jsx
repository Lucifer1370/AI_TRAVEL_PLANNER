import { FaStar } from "react-icons/fa";

const TestimonialCard = ({ name, role, review, image }) => {
    return (
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 hover:border-blue-500/40 transition duration-300">

            <div className="flex items-center gap-4">

                <img
                    src={image}
                    alt={name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-blue-500"
                />

                <div>
                    <h3 className="text-xl font-semibold">{name}</h3>
                    <p className="text-gray-400 text-sm">{role}</p>
                </div>

            </div>

            <div className="flex gap-1 mt-5 text-yellow-400">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
            </div>

            <p className="mt-5 text-gray-400 leading-7">
                "{review}"
            </p>

        </div>
    );
};

export default TestimonialCard;