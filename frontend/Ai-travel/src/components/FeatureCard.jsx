const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="group rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 transition-all duration-300 hover:-translate-y-2 hover:border-blue-500/50 hover:shadow-[0_0_40px_rgba(59,130,246,0.2)]">
      <div className="mb-5 text-5xl">{icon}</div>

      <h3 className="mb-3 text-2xl font-bold text-white">
        {title}
      </h3>

      <p className="leading-7 text-gray-400">
        {description}
      </p>
    </div>
  );
};

export default FeatureCard;