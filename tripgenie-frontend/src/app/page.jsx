"use client";

import Image from "next/image";
import {useState} from 'react';
import axios from 'axios';
import Itinerary from '../components/Itinerary/Itinerary';
import TripModal from "../components/TripModal/TripModal";
import ChatBot from "../components/ChatBot/ChatBot";
import HowItWorks from "../components/HowItWorks/HowItWorks";
import Features from "../components/Features/Features";
export default function Home() {

  const [destination, setDestination] = useState("");
  const [days, setDays] = useState("");
  const [budget, setBudget] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [preference, setPreference] = useState("");
  const [companion, setCompanion] = useState("");
   const [itinerary, setItinerary] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setItinerary("");
    
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
    setItinerary(data.plan);
    setModalOpen(true);
  } else {
    setItinerary("Failed to generate plan. Try again.");
  }
    } catch (err) {
      console.error(err);
      setItinerary("Error generating plan.");
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
        setModalOpen={setModalOpen}  currentPlan={itinerary} setUpdatedPlan={setItinerary}/>

        <ChatBot currentPlan={itinerary} setUpdatedPlan={setItinerary} />
        <HowItWorks />
        <Features />
         

   
     
    </main>
  );
}
