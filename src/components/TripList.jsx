import React from 'react'

const TripList = ({ tspOrderedVisits, hoveredBoxLabel, setHoveredBoxLabel }) => {


    return (
        <div className="ml-8 mr-4 mt-4 w-[220px] max-h-[460px] overflow-y-auto flex flex-col gap-3 border border-gray-300 rounded-xl p-4 shadow-md">
          <h3 className="font-semibold text-sm text-gray-200 mb-2">Trip Stops</h3>
          {tspOrderedVisits.length === 0 && (
            <div className="text-xs text-gray-300 italic">No stops yet</div>
          )}
          {tspOrderedVisits.map((label, i) => (
            <div
              key={label}
              onMouseEnter={() => setHoveredBoxLabel(label)}
              onMouseLeave={() => setHoveredBoxLabel(null)}
              className={`border rounded-md p-2 text-sm transition cursor-pointer 
                          ${hoveredBoxLabel === label ? 'bg-blue-100 border-blue-500' : ''}`}
            >
              <div className="font-medium">Stop {i + 1}</div>
              <div className="text-xs text-gray-200 break-all">{`Stop #${i + 1}`}</div>
            </div>
          ))}
        </div>
      );
}

export default TripList