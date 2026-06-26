import { FaRobot, FaWallet, FaGlobeAsia } from "react-icons/fa";
import FeatureCard from "./FeatureCard";

const Features = () => {
  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-16">

          <span className="text-blue-400 font-semibold">
            WHY CHOOSE US
          </span>

          <h2 className="text-4xl md:text-5xl font-bold mt-4">
            Everything You Need
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              {" "}For Your Trip
            </span>
          </h2>

          <p className="text-gray-400 mt-6 max-w-2xl mx-auto">
            Our AI helps you create smarter, faster and more personalized travel plans.
          </p>

        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

          <FeatureCard
            icon={<FaRobot className="text-blue-400" />}
            title="AI Itinerary"
            description="Generate complete travel plans in seconds based on your destination, budget and travel style."
          />

          <FeatureCard
            icon={<FaWallet className="text-purple-400" />}
            title="Budget Planning"
            description="Estimate expenses, hotels, transport and activities before you start your journey."
          />

          <FeatureCard
            icon={<FaGlobeAsia className="text-cyan-400" />}
            title="Smart Destinations"
            description="Discover the best attractions, restaurants and hidden gems recommended by AI."
          />

        </div>

      </div>
    </section>
  );
};

export default Features;