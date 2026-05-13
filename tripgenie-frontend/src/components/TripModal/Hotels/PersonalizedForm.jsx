import React, { useState } from "react";

const PersonalizeTrip = ({ onSubmit }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [step, setStep] = useState(1);
  const totalSteps = 5;

  const [answers, setAnswers] = useState({
    budget: [2000, 8000],
    location: "",
    rating: "",
    amenities: [],
    cancellation: "",
  });

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
    else handleSubmit();
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    setIsOpen(false);
    if (onSubmit) onSubmit(answers); // send answers to parent
  };

  // Toggle amenities
  const toggleAmenity = (amenity) => {
    setAnswers((prev) => {
      const exists = prev.amenities.includes(amenity);
      return {
        ...prev,
        amenities: exists
          ? prev.amenities.filter((a) => a !== amenity)
          : [...prev.amenities, amenity],
      };
    });
  };

  const renderQuestion = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h3 className="font-semibold mb-3">What's your budget per night?</h3>
            <p className="text-sm text-gray-500 mb-2">
              ₹{answers.budget[0].toLocaleString("en-IN")} - ₹
              {answers.budget[1].toLocaleString("en-IN")}
            </p>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="500"
                max="20000"
                step="500"
                value={answers.budget[0]}
                onChange={(e) =>
                  setAnswers((prev) => ({
                    ...prev,
                    budget: [+e.target.value, prev.budget[1]],
                  }))
                }
                className="w-full accent-blue-600"
              />
              <input
                type="range"
                min="500"
                max="20000"
                step="500"
                value={answers.budget[1]}
                onChange={(e) =>
                  setAnswers((prev) => ({
                    ...prev,
                    budget: [prev.budget[0], +e.target.value],
                  }))
                }
                className="w-full accent-blue-600"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div>
            <h3 className="font-semibold mb-3">Preferred location type?</h3>
            <div className="flex flex-wrap gap-3">
              {["Near attractions", "City center", "Quiet area"].map((loc) => (
                <button
                  key={loc}
                  onClick={() =>
                    setAnswers((prev) => ({ ...prev, location: loc }))
                  }
                  className={`px-4 py-2 rounded-full border ${
                    answers.location === loc
                      ? "bg-blue-600 text-white"
                      : "bg-white hover:bg-gray-100"
                  }`}
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div>
  <h3 className="font-semibold mb-3">Hotel star rating preference?</h3>
  <div className="flex flex-wrap gap-3">
    {["3★", "4★", "5★", "Any"].map((rate) => (
      <button
        key={rate}
        onClick={() =>
          setAnswers((prev) => {
            const exists = prev.rating.includes(rate);
            // Add or remove from the array
            return {
              ...prev,
              rating: exists
                ? prev.rating.filter((r) => r !== rate)
                : [...prev.rating, rate],
            };
          })
        }
        className={`px-4 py-2 rounded-full border ${
          answers.rating.includes(rate)
            ? "bg-blue-600 text-white"
            : "bg-white hover:bg-gray-100"
        }`}
      >
        {rate}
      </button>
    ))}
  </div>
</div>
        );

      case 4:
        return (
          <div>
            <h3 className="font-semibold mb-3">Preferred amenities?</h3>
            <div className="flex flex-wrap gap-3">
              {["Pool", "Gym", "Spa", "Free WiFi", "Parking", "Restaurant"].map(
                (amenity) => (
                  <button
                    key={amenity}
                    onClick={() => toggleAmenity(amenity)}
                    className={`px-4 py-2 rounded-full border ${
                      answers.amenities.includes(amenity)
                        ? "bg-blue-600 text-white"
                        : "bg-white hover:bg-gray-100"
                    }`}
                  >
                    {amenity}
                  </button>
                )
              )}
            </div>
          </div>
        );

      case 5:
        return (
          <div>
            <h3 className="font-semibold mb-3">
              Do you prefer free cancellation?
            </h3>
            <div className="flex gap-3">
              {["Yes", "No"].map((opt) => (
                <button
                  key={opt}
                  onClick={() =>
                    setAnswers((prev) => ({ ...prev, cancellation: opt }))
                  }
                  className={`px-4 py-2 rounded-full border ${
                    answers.cancellation === opt
                      ? "bg-blue-600 text-white"
                      : "bg-white hover:bg-gray-100"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="border rounded-2xl shadow-md bg-white overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left p-4 flex justify-between items-center bg-blue-50"
      >
        <span className="font-semibold text-lg">🎯 Personalise Your Stay</span>
        <span className="text-gray-600">{isOpen ? "▲" : "▼"}</span>
      </button>

      {/* Collapsible Body */}
      {isOpen && (
        <div className="h-[200px] p-6 flex flex-col justify-between transition-all">
          <div>
            <p className="text-sm text-gray-500 mb-2">
              Question {step} of {totalSteps}
            </p>
            {renderQuestion()}
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={handlePrev}
              disabled={step === 1}
              className={`px-4 py-2 rounded-lg border ${
                step === 1
                  ? "text-gray-400 border-gray-300 cursor-not-allowed"
                  : "text-blue-600 border-blue-600 hover:bg-blue-50"
              }`}
            >
              Previous
            </button>

            <button
              onClick={handleNext}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              {step === totalSteps ? "Submit" : "Next"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalizeTrip;
