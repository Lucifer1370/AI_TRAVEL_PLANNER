import DestinationCard from "./DestinationCard";

const places = [
    {
        name: "Goa",
        country: "India",
        rating: "4.9",
        price: "8,999",
        image:
            "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=900",
    },
    {
        name: "Bali",
        country: "Indonesia",
        rating: "4.8",
        price: "24,999",
        image:
            "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=900",
    },
    {
        name: "Paris",
        country: "France",
        rating: "4.9",
        price: "74,999",
        image:
            "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=900",
    },
];

const Destinations = () => {
    return (
        <section className="py-24 px-6">

            <div className="max-w-7xl mx-auto">

                <div className="text-center mb-16">

                    <span className="text-blue-400 font-semibold">
                        POPULAR DESTINATIONS
                    </span>

                    <h2 className="mt-4 text-5xl font-bold">
                        Explore The
                        <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                            {" "}Best Places
                        </span>
                    </h2>

                    <p className="mt-6 text-gray-400">
                        Discover the most loved destinations chosen by travelers.
                    </p>

                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

                    {places.map((place, index) => (
                        <DestinationCard
                            key={index}
                            {...place}
                        />
                    ))}

                </div>

            </div>

        </section>
    );
};

export default Destinations;