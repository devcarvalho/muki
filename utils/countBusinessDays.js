import dayjs from 'dayjs';

const countBusinessDays = (year, month) => {
    let startDate = dayjs(`${year}-${month}-01`);
    const endDate = startDate.endOf('month');
    let count = 0;
  
    while (startDate.isBefore(endDate)) {
      if (startDate.day() !== 0 && startDate.day() !== 6) {
        // Day 0 is Sunday, and day 6 is Saturday.
        count++;
      }
      startDate = startDate.add(1, 'day');
    }
  
    return count;
  }

export default countBusinessDays;
  
  
  
  
  
  