import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockLoanApplications, mockNotifications } from '@/data/mockData';

const LoanContext = createContext();

export const LoanProvider = ({ children }) => {
  const [applications, setApplications] = useState(() => {
    const savedApplications = localStorage.getItem('loanApplications');
    return savedApplications ? JSON.parse(savedApplications) : mockLoanApplications;
  });
  const [notifications, setNotifications] = useState(() => {
    const savedNotifications = localStorage.getItem('notifications');
    return savedNotifications ? JSON.parse(savedNotifications) : mockNotifications;
  });

  useEffect(() => {
    localStorage.setItem('loanApplications', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  const addApplication = (newApp) => {
    setApplications((prevApps) => [...prevApps, newApp]);
  };

  const updateApplication = (id, updates) => {
    setApplications((prevApps) =>
      prevApps.map((app) => (app.id === id ? { ...app, ...updates } : app))
    );
  };

  const addNotification = (newNotification) => {
    setNotifications((prevNotifs) => [...prevNotifs, newNotification]);
  };

  const getCustomerApplications = (customerID) => {
    return applications.filter(app => app.customerID === customerID);
  };

  return (
    <LoanContext.Provider
      value={{
        applications,
        setApplications, // Allow direct setting for mock updates
        addApplication,
        updateApplication,
        getCustomerApplications,
        notifications,
        addNotification,
      }}
    >
      {children}
    </LoanContext.Provider>
  );
};

export const useLoan = () => useContext(LoanContext);