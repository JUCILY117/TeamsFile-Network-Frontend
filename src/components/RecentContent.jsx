import React, { useState } from 'react';

const RecentContent = () => {
  const [filter, setFilter] = useState('all'); // State to manage selected filter
  const recentActivities = [
    {
      id: 1,
      activity: "John Doe created a new team: 'Developers'",
      timestamp: "2 hours ago",
      type: "team",
    },
    {
      id: 2,
      activity: "Alice Smith uploaded a document to 'Project X'",
      timestamp: "3 hours ago",
      type: "document",
    },
    {
      id: 3,
      activity: "Bob Johnson commented on a task in 'Marketing Team'",
      timestamp: "5 hours ago",
      type: "comment",
    },
    {
      id: 4,
      activity: "Emily Davis assigned a task to you in 'Design Team'",
      timestamp: "1 day ago",
      type: "assignment",
    },
    {
      id: 5,
      activity: "Michael Brown updated the status of 'Task 42'",
      timestamp: "2 days ago",
      type: "update",
    },
  ];

  // Function to filter activities based on selected filter
  const filterActivities = () => {
    switch (filter) {
      case '24h':
        return recentActivities.filter(activity => activity.timestamp.includes('hour'));
      case 'week':
        return recentActivities.filter(activity => activity.timestamp.includes('day'));
      case 'month':
        return recentActivities; // For now, we return all
      default:
        return recentActivities; // Show all by default
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen shadow-lg">
      <h1 className="text-4xl font-bold mb-6">Recent Activity</h1>
      <p className="mb-4">Check out the recent activities from your team members.</p>

      {/* Filter Options */}
      <div className="flex space-x-4 mb-6">
        {['all', '24h', 'week', 'month'].map((option) => (
          <button
            key={option}
            onClick={() => setFilter(option)}
            className={`px-6 py-2 rounded-md transition-colors duration-200
              ${filter === option ? 'bg-blue-900 font-bold' : 'bg-gray-700 hover:bg-blue-400 hover:text-black font-bold'}
            `}
          >
            {option === 'all' ? 'All Activities' : `Last ${option === '24h' ? '24 Hours' : option.charAt(0).toUpperCase() + option.slice(1)}`}
          </button>
        ))}
      </div>

      {/* Activity Overview Section */}
      <div className="bg-gray-800 rounded-md p-4 mb-6">
        <h2 className="text-2xl font-semibold mb-3">Overview</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-700 p-4 rounded-md">
            <h3 className="font-medium">Total Activities</h3>
            <p>{recentActivities.length}</p>
          </div>
          <div className="bg-gray-700 p-4 rounded-md">
            <h3 className="font-medium">Filtered Activities</h3>
            <p>{filterActivities().length}</p>
          </div>
        </div>
      </div>

      {/* Activity List Section */}
      <div className="bg-gray-800 rounded-md p-4">
        <h2 className="text-xl font-semibold mb-3">Recent Activities</h2>
        <ul className="list-disc pl-5">
          {filterActivities().map((activity) => (
            <li key={activity.id} className="mb-4 flex justify-between bg-gray-700 p-2 rounded-md">
              <div className="flex-1">
                <span className="font-medium">{activity.activity}</span>
                <span className="text-gray-400 text-sm ml-2">({activity.timestamp})</span>
              </div>
              <div className="flex items-center">
                <span className={`inline-block h-2 w-2 rounded-full ${activity.type === 'team' ? 'bg-green-500' : activity.type === 'document' ? 'bg-blue-500' : activity.type === 'comment' ? 'bg-yellow-500' : activity.type === 'assignment' ? 'bg-red-500' : 'bg-gray-500'}`} />
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Notify of New Activity */}
      <div className="mt-6 bg-blue-800 p-4 rounded-md">
        <h2 className="text-lg font-semibold mb-2">New Activity!</h2>
        <p>Don't forget to check out the latest updates from your teammates!</p>
      </div>
    </div>
  );
};

export default RecentContent;
