import { useState, useEffect } from "react";

export default function TripModal({ modalOpen, setModalOpen, initialPlan }) {
  // Ensure plan is always an array
  const [plan, setPlan] = useState(Array.isArray(initialPlan) ? initialPlan : []);
  const [minimized, setMinimized] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);
  const [addingActivity, setAddingActivity] = useState(null); // { dayIndex, title, time, desc }

  // Update plan if initialPlan changes
  useEffect(() => {
    if (Array.isArray(initialPlan)) setPlan(initialPlan);
  }, [initialPlan]);

  if (!modalOpen) return null;

  const handleDragStart = (e, dayIndex, actIndex) => {
    setDraggedItem({ dayIndex, actIndex });
    e.dataTransfer.effectAllowed = "move";
    e.currentTarget.style.opacity = "0.5";
  };

  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = "1";
    setDraggedItem(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, targetDayIndex, targetActIndex) => {
    e.preventDefault();
    
    if (!draggedItem) return;
    
    const { dayIndex: sourceDayIndex, actIndex: sourceActIndex } = draggedItem;
    
    if (sourceDayIndex === targetDayIndex && sourceActIndex === targetActIndex) {
      return;
    }

    const newPlan = JSON.parse(JSON.stringify(plan));
    
    const [movedActivity] = newPlan[sourceDayIndex].activities.splice(sourceActIndex, 1);
    newPlan[targetDayIndex].activities.splice(targetActIndex, 0, movedActivity);
    
    setPlan(newPlan);
    setDraggedItem(null);
  };

  const startEditing = (e, dayIndex, actIndex) => {
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
    setEditingActivity(null);
  };

  const deleteActivity = (e, dayIndex, actIndex) => {
    e.preventDefault();
    e.stopPropagation();
    const newPlan = [...plan];
    newPlan[dayIndex].activities.splice(actIndex, 1);
    setPlan(newPlan);
  };

  const openAddActivity = (dayIndex) => {
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
            <p className="mb-4 font-medium text-gray-700">
              Here is the Itinerary for your trip (Drag to reorder):
            </p>

            {Array.isArray(plan) &&
              plan.map((day, dayIndex) => (
                <div
                  key={dayIndex}
                  className="mb-6 bg-gray-50 p-4 rounded-xl shadow"
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
                          draggable
                          onDragStart={(e) => handleDragStart(e, dayIndex, actIndex)}
                          onDragEnd={handleDragEnd}
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, dayIndex, actIndex)}
                          className="bg-white border rounded-lg p-3 flex justify-between items-start gap-2 cursor-move hover:shadow-md transition-shadow"
                        >
                          <div className="flex-1 pointer-events-none">
                            <p className="font-medium">
                              {act.title} ({act.time})
                            </p>
                            <p className="text-gray-600 text-sm">{act.desc}</p>
                          </div>

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
                        </li>
                      ))}
                  </ul>

                  <button
                    onClick={() => openAddActivity(dayIndex)}
                    className="mt-3 w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    + Add Your Own Activity
                  </button>
                </div>
              ))}
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
    </>
  );
}