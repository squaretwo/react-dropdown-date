export const monthByNumber = {
    0: 'January',
    1: 'February',
    2: 'March',
    3: 'April',
    4: 'May',
    5: 'June',
    6: 'July',
    7: 'August',
    8: 'September',
    9: 'October',
    10: 'November',
    11: 'December'
};

export const numberByMonth = {
    January: 0,
    February: 1,
    March: 2,
    April: 3,
    May: 4,
    June: 5,
    July: 6,
    August: 7,
    September: 8,
    October: 9,
    November: 10,
    December: 11
};

export const daysInMonth = {
    0: 31,
    1: 28,
    2: 31,
    3: 30,
    4: 31,
    5: 30,
    6: 31,
    7: 31,
    8: 30,
    9: 31,
    10: 30,
    11: 31
};

export const unit = {
    day: 'day',
    month: 'month',
    year: 'year'
};

export function getDaysInMonth(selectedMonth: number, selectedYear: number) {
    const monthStart = new Date(selectedYear, selectedMonth, 1).valueOf();
    const monthEnd = new Date(selectedYear, selectedMonth + 1, 1).valueOf();
    return Math.round((monthEnd - monthStart) / (1000 * 60 * 60 * 24));
}