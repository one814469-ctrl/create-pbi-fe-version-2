import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils'; // Import cn utility

const Navigation = ({ epics, isAuthenticated }) => {
  return (
    <nav className="w-60 min-w-[15rem] bg-card p-4 shadow-sm border-r border-border">
      <h3 className="text-lg font-semibold mb-4 text-primary">Epics</h3>
      <ul className="space-y-2">
        {epics.map((epic) => {
          const slug = epic.title.toLowerCase().replace(/\s+/g, '-');
          return (
            <li key={epic.title}>
              <NavLink
                to={`/epics/${slug}`}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-muted hover:text-primary",
                    isActive && "bg-muted text-primary hover:text-primary"
                  )
                }
              >
                {epic.title}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Navigation;