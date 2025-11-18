// src/router.jsx
import epicsData from './data/epics.json';

// Dynamically generate routes based on epicsData
export const appRoutes = epicsData.map(epic => ({
  path: `/epic/${epic.title.toLowerCase().replace(/ /g, '-')}`,
  epic: epic, // Pass the entire epic object to the route element
}));