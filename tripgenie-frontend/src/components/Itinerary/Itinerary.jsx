import { DragDropContext, Droppable, Draggable} from "react-beautiful-dnd";

export default function Itinerary({ plan, setPlan }) {
  const onDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination } = result;

    const dayIndex = source.droppableId;
    const destDayIndex = destination.droppableId;

    // copy
    const newPlan = [...plan];
    const [movedItem] = newPlan[dayIndex].activities.splice(source.index, 1);
    newPlan[destDayIndex].activities.splice(destination.index, 0, movedItem);

    setPlan(newPlan);
  };

  const removeActivity = (dayIndex, actIndex) => {
    const newPlan = [...plan];
    newPlan[dayIndex].activities.splice(actIndex, 1);
    setPlan(newPlan);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="space-y-6">
        {plan.map((day, dayIndex) => (
          <div key={day.day} className="bg-gray-50 p-4 rounded-xl shadow">
            <h2 className="font-bold text-lg mb-2">Day {day.day}</h2>
            <Droppable droppableId={`${dayIndex}`}>
              {(provided) => (
                <ul
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-2"
                >
                  {day.activities.map((act, actIndex) => (
                    <Draggable
                      key={act.id}
                      draggableId={act.id}
                      index={actIndex}
                    >
                      {(provided) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-white border rounded-lg p-3 flex justify-between items-center"
                        >
                          <span>{act.title} ({act.time})</span>
                          <button
                            onClick={() => removeActivity(dayIndex, actIndex)}
                            className="text-red-600 text-sm"
                          >
                            ✕
                          </button>
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}
