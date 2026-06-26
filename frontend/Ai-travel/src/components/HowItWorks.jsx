import StepCard from "./StepCard";

const HowItWorks = () => {
    return (
        <section className="py-24 px-6">

            <div className="max-w-7xl mx-auto">

                <div className="text-center">

                    <span className="text-blue-400 font-semibold">
                        HOW IT WORKS
                    </span>

                    <h2 className="mt-4 text-5xl font-bold">
                        Create Your Trip In
                        <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                            {" "}3 Easy Steps
                        </span>
                    </h2>

                    <p className="mt-6 text-gray-400">
                        Plan your next vacation with AI in just a few clicks.
                    </p>

                </div>

                <div className="mt-20 grid gap-8 md:grid-cols-3">

                    <StepCard
                        number="1"
                        title="Choose Destination"
                        description="Enter your destination, number of days, budget and travelers."
                    />

                    <StepCard
                        number="2"
                        title="AI Generates Plan"
                        description="Our AI instantly creates a personalized travel itinerary."
                    />

                    <StepCard
                        number="3"
                        title="Enjoy Your Journey"
                        description="Save your itinerary and start exploring with confidence."
                    />

                </div>

            </div>

        </section>
    );
};

export default HowItWorks;