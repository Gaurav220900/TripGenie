// components/Features.js
import { FaHotel, FaCoffee, FaCloudSun, FaMoneyBillWave } from 'react-icons/fa';

const Features = () => {
  const features = [
    {
      icon: <FaHotel className="text-4xl text-blue-500" />,
      title: "Recommended Hotels",
      description: "Get the best hotel options curated based on your preferences and ratings.",
    },
    {
      icon: <FaCoffee className="text-4xl text-green-500" />,
      title: "Recommended Cafes/Restaurants",
      description: "Explore top-rated cafes and restaurants with real-time reviews and menus.",
    },
    {
      icon: <FaCloudSun className="text-4xl text-yellow-500" />,
      title: "Live Weather Forecast",
      description: "Stay updated with accurate weather forecasts for your destination.",
    },
    {
      icon: <FaMoneyBillWave className="text-4xl text-purple-500" />,
      title: "Budget Friendly Adjustment",
      description: "Optimize your itinerary according to your budget preferences effortlessly.",
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-12">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center text-center hover:scale-105 transition-transform duration-300"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
