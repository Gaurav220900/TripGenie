// components/HowItWorks.js
import { FaMapMarkerAlt, FaRobot, FaShareAlt } from 'react-icons/fa';

const HowItWorks = () => {
  const steps = [
    {
      icon: <FaMapMarkerAlt className="text-4xl text-blue-500" />,
      title: "Enter destination & preferences",
    },
    {
      icon: <FaRobot className="text-4xl text-green-500" />,
      title: "AI generates itinerary with enriched real data",
    },
    {
      icon: <FaShareAlt className="text-4xl text-purple-500" />,
      title: "Save, share, or tweak your plan",
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-12">How it Works</h2>
        <div className="flex flex-col md:flex-row gap-8 justify-center">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex-1 bg-white p-6 rounded-xl shadow-lg flex flex-col items-center text-center hover:scale-105 transition-transform duration-300" >
              <div className="mb-4">{step.icon}</div>
              <p className="text-lg font-medium">{step.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
