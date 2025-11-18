// src/lib/traceability.js
const fs = require('fs');
const path = require('path');

const epicsData = require('../data/epics.json');

const TRACEABILITY_FILE = path.join(__dirname, '../../traceability.json');

const componentMappings = {
  "loan-application-form": "src/components/task-implementations/LoanApplicationFormTask.jsx",
  "status-tracker": "src/components/task-implementations/ApplicationStatusTrackerTask.jsx",
  "document-upload-ocr": "src/components/task-implementations/DocumentUploadOcrTask.jsx",
  "credit-check-display": "src/components/task-implementations/CreditCheckApiDisplayTask.jsx",
  "notification-sender": "src/components/task-implementations/NotificationSenderTask.jsx",
  "reporting-dashboard": "src/components/task-implementations/ReportingDashboardTask.jsx"
};

function generateTraceabilityManifest() {
  const traceability = {};

  epicsData.forEach(epic => {
    const epicSlug = epic.title.toLowerCase().replace(/ /g, '-');
    traceability[epicSlug] = {
      epicId: epic.id,
      title: epic.title,
      description: epic.description,
      relatedPRDSection: epic.relatedPRDSection,
      file: `src/components/EpicPage/EpicPage.jsx (renders Epic: ${epic.id})`,
      route: `/epic/${epicSlug}`,
      userStories: {}
    };

    epic.userStories.forEach(story => {
      traceability[epicSlug].userStories[story.id] = {
        title: story.title,
        description: story.description,
        relatedPRDSection: story.relatedPRDSection,
        file: `src/components/EpicPage/UserStoryBlock.jsx (renders Story: ${story.id})`,
        tasks: {}
      };

      story.tasks.forEach(task => {
        const taskComponentPath = componentMappings[task.type] || "src/components/dynamic/DynamicTaskFeature.jsx (generic wrapper)";
        traceability[epicSlug].userStories[story.id].tasks[task.id] = {
          title: task.title,
          description: task.description,
          component: taskComponentPath,
          acceptanceCriteria: task.acceptance_criteria.map(ac => ({
            criterion: ac,
            // In a real system, you'd have automated tests or manual verification status here
            status: "Mocked/Simulated in UI" 
          }))
        };
      });
    });
  });

  fs.writeFileSync(TRACEABILITY_FILE, JSON.stringify(traceability, null, 2), 'utf-8');
  console.log(`Traceability manifest generated at: ${TRACEABILITY_FILE}`);
}

generateTraceabilityManifest();