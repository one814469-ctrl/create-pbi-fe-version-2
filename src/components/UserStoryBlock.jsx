import React from 'react';
import DynamicTaskFeature from '@/components/DynamicTaskFeature';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const UserStoryBlock = ({ userStory, displayMessage }) => {
  return (
    <Card className="bg-card shadow-sm border-l-4 border-[--primary] rounded-lg"> {/* border-[--primary] uses the custom CSS var */}
      <CardHeader>
        <CardTitle className="text-xl text-primary">{userStory.title}</CardTitle>
        <CardDescription>{userStory.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-0">
        {userStory.tasks.map((task) => (
          <div key={task.title} className="pt-4 border-t border-border first:border-t-0 first:pt-0">
            <h4 className="text-lg font-semibold text-foreground mb-2">{task.title}</h4>
            <p className="text-sm text-muted-foreground mb-4">{task.description}</p>
            <DynamicTaskFeature task={task} displayMessage={displayMessage} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default UserStoryBlock;