import { Link } from "react-router-dom";

const CTA = () => {
    return (
        <section className="px-6 py-24">
            <div className="max-w-6xl mx-auto rounded-3xl border border-white/10 bg-gradient-to-r from-blue-600/20 via-slate-900 to-purple-600/20 backdrop-blur-xl p-12 text-center">

                <h2 className="text-4xl md:text-5xl font-bold">
                    Ready For Your
                    <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        {" "}Next Adventure?
                    </span>
                </h2>

                <p className="mt-6 text-gray-300 max-w-2xl mx-auto">
                    Let AI create your complete travel itinerary in just a few seconds.
                    Plan smarter, travel better.
                </p>

                <Link
                    to="/generate-trip"
                    className="inline-block mt-10 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 text-lg font-semibold hover:scale-105 transition duration-300"
                >
                    ✈ Generate My Trip
                </Link>

            </div>
        </section>
    );
};

export default CTA;