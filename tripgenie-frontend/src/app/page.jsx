"use client";

import Image from "next/image";
import {useState} from 'react';
import axios from 'axios';
import Itinerary from '../components/Itinerary/Itinerary';
import TripModal from "../components/TripModal/TripModal";
export default function Home() {

  const [destination, setDestination] = useState("");
  const [days, setDays] = useState("");
  const [budget, setBudget] = useState("");
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [preference, setPreference] = useState("");
  const [companion, setCompanion] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPlan("");

    try {
      const res = await axios.post("http://127.0.0.1:4000/api/plan-trip", {
    destination,
    days,
    budget,
    preference,
    companion
  });
       const data = res.data; // Axios automatically parses JSON
  if (data.plan) {
    setPlan(data.plan);
    setModalOpen(true);
  } else {
    setPlan("Failed to generate plan. Try again.");
  }
    } catch (err) {
      console.error(err);
      setPlan("Error generating plan.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <main className="max-w-7xl mx-auto px-6">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center gap-12">
        {/* Left: Text + Form */}
        <div className="flex-1 space-y-3">
          <h1 className="text-8xl font-extrabold text-gray-900 leading-tight">
            Plan Less, <span className="text-blue-700">Travel More</span>
          </h1>
          <p className="text-lg p-6 text-gray-600">
            TripGenie crafts smart, personalized itineraries powered by AI —
            enriched with real-time weather, hotels, and attractions.
          </p>

      
{/* Form */}
<form className="bg-white shadow-md rounded-xl p-6 w-full space-y-4" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex w-full gap-4">
          <input
            type="number"
            placeholder="Number of Days"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            className="w-1/2 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            placeholder="Budget (in INR)"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="w-1/2 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>

       <div className="flex w-full gap-4 ">
         <select
    className="w-1/2 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 text-gray-500"
    onChange={(e) => setPreference(e.target.value)}
   
  >
    <option value="">Select Preference</option>
    <option value="adventurous">Adventurous</option>
    <option value="relaxing">Relaxing</option>
    <option value="pet-friendly">Pet-friendly</option>
    <option value="cultural">Cultural / Heritage</option>
    <option value="nature">Nature / Scenic</option>
    <option value="nightlife">Nightlife</option>
  </select>

  {/* Travel Companion */}
  <select
    className="w-1/2 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 text-gray-500"
    onChange={(e) => setCompanion(e.target.value)}
  >
    <option value="">Traveling With</option>
    <option value="solo">Solo</option>
    <option value="couple">Couple</option>
    <option value="family">Family</option>
    <option value="friends">Friends</option>
  </select>

    </div>
        <button
          type="submit"
          className="w-full bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-800"
          disabled={loading}
        >
          {loading ? "Generating..." : "Plan My Trip"}
        </button>
      </form>
     
      </div>
      {/* Right: Illustration / Placeholder */}
        <div className="flex-1">
          <div>
            <Image
              src="/ChatGPT Image Sep 30, 2025, 12_13_56 PM.png"
              alt="TripGenie Icon"
              width={600}
              height={500}
              priority
            />
              </div>
        </div>
        
         </section>

         <TripModal  modalOpen={modalOpen} 
        setModalOpen={setModalOpen}  initialPlan={plan} />
         

    { /*  {modalOpen && (
  <>
    {!minimized && (
      <div
        className="fixed inset-0 bg-black/30 z-40"
        onClick={() => setModalOpen(false)}
      ></div>
    )}

    <div
      className={`fixed z-50 bg-white shadow-lg rounded-xl transition-all duration-300 ${
        minimized
          ? "bottom-4 right-4 w-64 h-12 cursor-pointer"
          : "inset-0 m-auto w-full max-w-lg max-h-[80vh]"
      } flex flex-col`}
    >
      <div
        className="flex justify-between items-center p-3 border-b cursor-pointer"
        onClick={() => minimized && setMinimized(false)}
      >
        <h2 className="text-lg font-semibold">Your Trip Plan</h2>
        <div className="flex gap-2">
          {!minimized && (
            <button
              onClick={() => setMinimized(true)}
              className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
              Minimize
            </button>
          )}
          <button
            onClick={() => setModalOpen(false)}
            className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Close
          </button>
        </div>
      </div>

     {!minimized && (
        <div className="p-4 overflow-y-auto max-h-[70vh] space-y-4">
          <h2 className="text-md font-large text-gray-700 mb-3">
            Here is the itinerary for your trip:
          </h2>

          {plan && plan.length > 0 ? (
            <div className="space-y-6">
              {plan.map((day) => (
                <div key={day.day} className="bg-gray-50 p-4 rounded-xl shadow">
                  <h4 className="font-bold text-lg mb-2">Day {day.day}</h4>
                  <ul className="space-y-2">
                    {day.activities.map((act) => (
                      <li
                        key={act.id}
                        className="bg-white border rounded-lg p-3"
                      >
                        <span className="font-medium">{act.time}:</span>{" "}
                        <span className="font-semibold">{act.title}</span> —{" "}
                        <span>{act.desc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No itinerary available.</p>
          )}
        </div>
      )}


      {minimized && (
        <div className="flex items-center justify-center h-full">
          <span className="text-gray-700 font-medium truncate">
            Trip Plan (Click to Expand)
          </span>
        </div>
      )}
    </div>
  </>
) */}
     
    </main>
  );
}
