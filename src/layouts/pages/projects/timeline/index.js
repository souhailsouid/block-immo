import PropTypes from 'prop-types';

// Material Dashboard 3 PRO React components
import MDBox from 'components/MDBox';

// Material Dashboard 3 PRO React examples
import TimelineList from 'examples/Timeline/TimelineList';
import TimelineItem from 'examples/Timeline/TimelineItem';

const Timeline = ({ timelineData }) => {
  
const currentTimelineData = timelineData || [];

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

Timeline.propTypes = {
  timelineData: PropTypes.array.isRequired,
};

export default Timeline;
