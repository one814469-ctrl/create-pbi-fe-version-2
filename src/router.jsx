import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Home from './pages/Home';
import EpicPage from './pages/EpicPage';
import epics from './data/epics.json';
import { slugify } from './utils/helpers';
import { useNotification } from './components/common/Notification';

const dynamicRoutes = epics.map(epic => ({
  path: `/epic/${slugify(epic.title)}`,
  element: <EpicPage />,
}));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      ...dynamicRoutes,
    ],
  },
]);