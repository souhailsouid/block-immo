// Default timeline data
let timelineData = [
  {
    color: 'success',
    icon: 'check',
    title: 'Property funding complete!',
    dateTime: '10th July 2025',
    description: 'The property has been fully funded by investors.',
    badges: ['check'],
  },
  {
    color: 'info',
    icon: 'vpn_key',
    title: 'Share certificates issued',
    dateTime: '25th July 2025',
    description:
      'Your Property Share Certificates will be issued 2 weeks after the property is funded.',
    badges: ['check'],
  },
  {
    color: 'secondary',
    icon: 'payments',
    title: 'First rental payment',
    dateTime: '30th September 2025',
    description:
      'We project that the first rental payment will be paid by 31 August 2025, with a guaranteed payment date no later than 30 September 2025.',
    badges: ['check'],
    lastItem: true,
  },
];

// Function to update timeline data
export const updateTimelineData = (newData) => {
  timelineData = newData;
};

// Function to get timeline data
export const getTimelineData = () => {
  return timelineData;
};

export default timelineData;
