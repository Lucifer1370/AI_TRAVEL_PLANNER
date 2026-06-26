import React from "react";

const StepCard = ({ number, title, description }) => {
    return (
        <div className="relative rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl hover:border-blue-500/40 transition-all duration-300 hover:-translate-y-2">

            <div className="absolute -top-5 left-8 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-xl font-bold">
                {number}
            </div>

            <h3 className="mt-8 text-2xl font-bold text-white">
                {title}
            </h3>

            <p className="mt-4 leading-7 text-gray-400">
                {description}
            </p>

        </div>
    );
};

export default StepCard;