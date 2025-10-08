import { useState, useEffect, useRef } from "react";

export default function TripModal({ modalOpen, setModalOpen, currentPlan }) {
  const [plan, setPlan] = useState([]);
  const [displayedPlan, setDisplayedPlan] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);
  const [addingActivity, setAddingActivity] = useState(null);
  const typingRef = useRef(null);

  // Update plan when currentPlan changes and start typewriter effect
  useEffect(() => {
    if (Array.isArray(currentPlan) && currentPlan.length > 0) {
      setPlan(currentPlan);
      setDisplayedPlan([]);
      setIsTyping(true);
    }
  }, [currentPlan]);

  // Typewriter effect
  useEffect(() => {
    if (!isTyping || plan.length === 0) return;

    let dayIndex = 0;
    let activityIndex = 0;
    const newDisplayedPlan = [];

    const typeNextItem = () => {
      if (dayIndex >= plan.length) {
        setIsTyping(false);
        return;
      }

      const currentDay = plan[dayIndex];
      
      // If this day hasn't been added yet, add it with empty activities
      if (!newDisplayedPlan[dayIndex]) {
        newDisplayedPlan[dayIndex] = {
          ...currentDay,
          activities: []
        };
        setDisplayedPlan([...newDisplayedPlan]);
        
        // Small delay before adding first activity
        typingRef.current = setTimeout(typeNextItem, 150);
        return;
      }

      // Add activities one by one
      if (activityIndex < currentDay.activities.length) {
        newDisplayedPlan[dayIndex].activities.push(currentDay.activities[activityIndex]);
        setDisplayedPlan([...newDisplayedPlan]);
        activityIndex++;
        
        // Delay between activities
        typingRef.current = setTimeout(typeNextItem, 300);
      } else {
        // Move to next day
        dayIndex++;
        activityIndex = 0;
        
        // Delay between days
        typingRef.current = setTimeout(typeNextItem, 500);
      }
    };

    typingRef.current = setTimeout(typeNextItem, 300);

    return () => {
      if (typingRef.current) {
        clearTimeout(typingRef.current);
      }
    };
  }, [isTyping, plan]);

  // Skip typewriter effect
  const skipTypewriter = () => {
    if (typingRef.current) {
      clearTimeout(typingRef.current);
    }
    setDisplayedPlan(plan);
    setIsTyping(false);
  };

  if (!modalOpen) return null;

  const handleDragStart = (e, dayIndex, actIndex) => {
    if (isTyping) return; // Prevent dragging during typing
    setDraggedItem({ dayIndex, actIndex });
    e.dataTransfer.effectAllowed = "move";
    e.currentTarget.style.opacity = "0.5";
  };

  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = "1";
    setDraggedItem(null);
  };

  const handleDragOver = (e) => {
    if (isTyping) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, targetDayIndex, targetActIndex) => {
    e.preventDefault();
    
    if (isTyping || !draggedItem) return;
    
    const { dayIndex: sourceDayIndex, actIndex: sourceActIndex } = draggedItem;
    
    if (sourceDayIndex === targetDayIndex && sourceActIndex === targetActIndex) {
      return;
    }

    const newPlan = JSON.parse(JSON.stringify(plan));
    
    const [movedActivity] = newPlan[sourceDayIndex].activities.splice(sourceActIndex, 1);
    newPlan[targetDayIndex].activities.splice(targetActIndex, 0, movedActivity);
    
    setPlan(newPlan);
    setDisplayedPlan(newPlan);
    setDraggedItem(null);
  };

  const startEditing = (e, dayIndex, actIndex) => {
    if (isTyping) return;
    e.preventDefault();
    e.stopPropagation();
    const act = plan[dayIndex].activities[actIndex];
    setEditingActivity({ dayIndex, actIndex, ...act });
  };

  const saveEdit = () => {
    const newPlan = [...plan];
    const { dayIndex, actIndex, title, time, desc } = editingActivity;
    newPlan[dayIndex].activities[actIndex] = {
      ...newPlan[dayIndex].activities[actIndex],
      title,
      time,
      desc,
    };
    setPlan(newPlan);
    setDisplayedPlan(newPlan);
    setEditingActivity(null);
  };

  const deleteActivity = (e, dayIndex, actIndex) => {
    if (isTyping) return;
    e.preventDefault();
    e.stopPropagation();
    const newPlan = [...plan];
    newPlan[dayIndex].activities.splice(actIndex, 1);
    setPlan(newPlan);
    setDisplayedPlan(newPlan);
  };

  const openAddActivity = (dayIndex) => {
    if (isTyping) return;
    setAddingActivity({ dayIndex, title: "", time: "", desc: "" });
  };

  const saveNewActivity = () => {
    const newPlan = [...plan];
    const { dayIndex, title, time, desc } = addingActivity;
    const newActivity = {
      id: `${Date.now()}`,
      title: title || "New Activity",
      time: time || "TBD",
      desc: desc || "No description"
    };
    newPlan[dayIndex].activities.push(newActivity);
    setPlan(newPlan);
    setDisplayedPlan(newPlan);
    setAddingActivity(null);
  };

  return (
    <>
      {/* Overlay */}
      {!minimized && (
        <div
          className="fixed inset-0 bg-black/30 z-40"
          onClick={() => setModalOpen(false)}
        />
      )}

      {/* Modal */}
      <div
        className={`fixed z-50 bg-white shadow-lg rounded-xl transition-all duration-300 ${
          minimized
            ? "bottom-4 right-4 w-64 h-12 cursor-pointer"
            : "inset-0 m-auto w-full max-w-lg max-h-[80vh]"
        } flex flex-col`}
      >
        {/* Header */}
        <div
          className="flex justify-between items-center p-3 border-b cursor-pointer"
          onClick={() => minimized && setMinimized(false)}
        >
          <h2 className="text-lg font-semibold">Your Trip Plan</h2>
          <div className="flex gap-2">
            {!minimized && isTyping && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  skipTypewriter();
                }}
                className="px-2 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 text-sm"
              >
                Skip
              </button>
            )}
            {!minimized && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // PDF download functionality will be added later
                }}
                className="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16"
                  />
                </svg>
                PDF
              </button>
            )}
            {!minimized && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMinimized(true);
                }}
                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                Minimize
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setModalOpen(false);
              }}
              className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>

        {/* Modal Body */}
        {!minimized && (
          <div className="p-4 overflow-y-auto max-h-[70vh]">
            <div className="flex justify-between items-center mb-4">
              <p className="font-medium text-gray-700">
                Here is the Itinerary for your trip {!isTyping && "(Drag to reorder)"}:
              </p>
              {isTyping && (
                <span className="inline-flex items-center gap-1 text-blue-600 text-sm">
                  <span className="animate-pulse">●</span> Generating...
                </span>
              )}
            </div>

            {Array.isArray(displayedPlan) &&
              displayedPlan.map((day, dayIndex) => (
                <div
                  key={dayIndex}
                  className="mb-6 bg-gray-50 p-4 rounded-xl shadow animate-fadeIn"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">
                        Day {day.day}: {day.destination || ""}
                      </h3>
                    </div>
                    
                    <div className="flex gap-3 items-center">
                      {/* Budget Display */}
                      {day.budget_allocation && (
                        <div className="bg-green-100 px-3 py-1 rounded-lg">
                          <p className="text-xs text-gray-600">Budget/Day</p>
                          <p className="font-semibold text-green-700">
                            {typeof day.budget_allocation === 'string' 
                              ? day.budget_allocation 
                              : `₹${Object.values(day.budget_allocation).reduce((a, b) => a + b, 0)}`
                            }
                          </p>
                        </div>
                      )}
                      
                      {/* Weather Button */}
                      <button className="bg-blue-100 hover:bg-blue-200 px-3 py-2 rounded-lg transition-colors">
                        <span className="text-xl">🌤️</span>
                      </button>
                    </div>
                  </div>

                  {day.budget_allocation && (
                    <div className="text-sm text-gray-500 mb-2">
                      <p className="font-medium">Budget Breakdown:</p>
                      {typeof day.budget_allocation === 'string' ? (
                        <p>{day.budget_allocation}</p>
                      ) : (
                        <ul className="ml-4 text-xs">
                          <li>Accommodation: ${day.budget_allocation.accommodation}</li>
                          <li>Transport: ${day.budget_allocation.transport}</li>
                          <li>Food: ${day.budget_allocation.food}</li>
                          <li>Activities: ${day.budget_allocation.activities}</li>
                          <li>Miscellaneous: ${day.budget_allocation.miscellaneous}</li>
                        </ul>
                      )}
                    </div>
                  )}

                  <ul className="space-y-2">
                    {day.activities &&
                      day.activities.map((act, actIndex) => (
                        <li
                          key={`${dayIndex}-${actIndex}`}
                          draggable={!isTyping}
                          onDragStart={(e) => handleDragStart(e, dayIndex, actIndex)}
                          onDragEnd={handleDragEnd}
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, dayIndex, actIndex)}
                          className={`bg-white border rounded-lg p-3 flex justify-between items-start gap-2 hover:shadow-md transition-all animate-slideIn ${
                            !isTyping ? 'cursor-move' : ''
                          }`}
                        >
                          <div className="flex-1 pointer-events-none">
                            <p className="font-medium">
                              {act.title} ({act.time})
                            </p>
                            <p className="text-gray-600 text-sm">{act.desc}</p>
                          </div>

                          {!isTyping && (
                            <div className="flex flex-col gap-1 pointer-events-auto">
                              <button
                                onMouseDown={(e) => startEditing(e, dayIndex, actIndex)}
                                className="text-blue-600 text-sm cursor-pointer hover:underline"
                              >
                                Edit
                              </button>
                              <button
                                onMouseDown={(e) => deleteActivity(e, dayIndex, actIndex)}
                                className="text-red-600 text-sm cursor-pointer hover:underline"
                              >
                                ✕
                              </button>
                            </div>
                          )}
                        </li>
                      ))}
                  </ul>

                  {!isTyping && (
                    <button
                      onClick={() => openAddActivity(dayIndex)}
                      className="mt-3 w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      + Add Your Own Activity
                    </button>
                  )}
                </div>
              ))}

            {isTyping && displayedPlan.length > 0 && (
              <div className="flex items-center gap-2 text-gray-500 text-sm mt-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            )}
          </div>
        )}

        {/* Minimized View */}
        {minimized && (
          <div
            className="flex items-center justify-center h-full cursor-pointer"
            onClick={() => setMinimized(false)}
          >
            <span className="text-gray-700 font-medium truncate">
              Trip Plan (Click to Expand)
            </span>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingActivity && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[100]">
          <div className="bg-white p-4 rounded-lg shadow-xl w-[350px] relative z-[101]">
            <h3 className="font-semibold mb-3 text-lg">Edit Activity</h3>
            <input
              value={editingActivity.title}
              onChange={(e) =>
                setEditingActivity({ ...editingActivity, title: e.target.value })
              }
              placeholder="Title"
              className="border p-2 rounded w-full mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              value={editingActivity.time}
              onChange={(e) =>
                setEditingActivity({ ...editingActivity, time: e.target.value })
              }
              placeholder="Time"
              className="border p-2 rounded w-full mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              value={editingActivity.desc}
              onChange={(e) =>
                setEditingActivity({ ...editingActivity, desc: e.target.value })
              }
              placeholder="Description"
              className="border p-2 rounded w-full mb-2 h-20 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end gap-2 mt-3">
              <button
                onClick={() => setEditingActivity(null)}
                className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Activity Modal */}
      {addingActivity && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[100]">
          <div className="bg-white p-4 rounded-lg shadow-xl w-[450px] relative z-[101]">
            <h3 className="font-semibold mb-3 text-lg">Add New Activity</h3>
            <input
              value={addingActivity.title}
              onChange={(e) =>
                setAddingActivity({ ...addingActivity, title: e.target.value })
              }
              placeholder="Title"
              className="border p-2 rounded w-full mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              value={addingActivity.time}
              onChange={(e) =>
                setAddingActivity({ ...addingActivity, time: e.target.value })
              }
              placeholder="Time (e.g., 10:00 AM)"
              className="border p-2 rounded w-full mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              value={addingActivity.desc}
              onChange={(e) =>
                setAddingActivity({ ...addingActivity, desc: e.target.value })
              }
              placeholder="Description"
              className="border p-2 rounded w-full mb-2 h-20 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end gap-2 mt-3">
              <button
                onClick={() => setAddingActivity(null)}
                className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={saveNewActivity}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }

        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
}