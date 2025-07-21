import { useState, useEffect } from 'react';

// Material Dashboard 3 PRO React components
import MDBox from 'components/MDBox';

// Material Dashboard 3 PRO React examples
import TimelineList from 'examples/Timeline/TimelineList';
import TimelineItem from 'examples/Timeline/TimelineItem';

// Data
import timelineData, { getTimelineData } from 'layouts/pages/projects/timeline/data/timelineData';

const Timeline = () => {
  const [currentTimelineData, setCurrentTimelineData] = useState(timelineData);

  // Update timeline data when it changes
  useEffect(() => {
    const interval = setInterval(() => {
      const updatedData = getTimelineData();
      if (JSON.stringify(updatedData) !== JSON.stringify(currentTimelineData)) {
        setCurrentTimelineData(updatedData);
      }
    }, 1000); // Check every second for updates

    return () => clearInterval(interval);
  }, [currentTimelineData]);

  const renderTimelineItems = currentTimelineData.map(
    ({ color, icon, title, dateTime, description, badges, lastItem }) => (
      <TimelineItem
        key={title + color}
        color={color}
        icon={icon}
        title={title}
        dateTime={dateTime}
        description={description}
        badges={badges}
        lastItem={lastItem}
      />
    )
  );

  return (
    <MDBox my={3}>
      <TimelineList timeline title="Funding timeline">
        {' '}
        {renderTimelineItems}
      </TimelineList>
    </MDBox>
  );
}

export default Timeline;
