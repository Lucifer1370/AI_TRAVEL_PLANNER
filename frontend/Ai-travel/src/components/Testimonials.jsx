import TestimonialCard from "./TestimonialCard";

const testimonials = [
    {
        name: "Rahul Sharma",
        role: "Solo Traveler",
        review:
            "This AI planner saved me hours of planning. Everything was perfectly organized.",
        image: "https://i.pravatar.cc/150?img=11",
    },
    {
        name: "Priya Patel",
        role: "Travel Blogger",
        review:
            "The itinerary was accurate and the hotel recommendations were amazing.",
        image: "https://i.pravatar.cc/150?img=32",
    },
    {
        name: "Alex Johnson",
        role: "Adventure Explorer",
        review:
            "One of the best travel planning websites I've ever used.",
        image: "https://i.pravatar.cc/150?img=15",
    },
];

const Testimonials = () => {
    return (
        <section className="py-24 px-6">

            <div className="max-w-7xl mx-auto">

                <div className="text-center mb-16">

                    <span className="text-blue-400 font-semibold">
                        TESTIMONIALS
                    </span>

                    <h2 className="mt-4 text-5xl font-bold">
                        What Our
                        <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                            {" "}Travelers Say
                        </span>
                    </h2>

                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

                    {testimonials.map((item, index) => (
                        <TestimonialCard key={index} {...item} />
                    ))}

                </div>

            </div>

        </section>
    );
};

export default Testimonials;