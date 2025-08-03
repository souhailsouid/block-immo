export const formatDateForDisplay = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const options = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    };
    return d.toLocaleDateString('en-US', options);
  };