import * as React from 'react';
import { getDaysInMonth, monthByNumber } from './helper';

export enum DropdownComponent {
    year = 'year',
    month = 'month',
    day = 'day',
}

interface IProps {
    startDate?: string;
    endDate?: string;
    selectedDate?: string;
    order?: DropdownComponent[];
    onMonthChange?: Function;
    onDayChange?: Function;
    onYearChange?: Function;
    onDateChange?: Function;
    ids?: {
        year?: string;
        month?: string;
        day?: string;
    };
    names?: {
        year?: string;
        month?: string;
        day?: string;
    };
    classes?: {
        dateContainer?: string;
        yearContainer?: string;
        monthContainer?: string;
        dayContainer?: string;
        year?: string;
        month?: string;
        day?: string;
        yearOptions?: string;
        monthOptions?: string;
        dayOptions?: string;
    };
    defaultValues?: {
        year?: string;
        month?: string;
        day?: string;
    };
    options?: {
        yearReverse?: boolean;
        monthShort?: boolean;
        monthCaps?: boolean;
    };
}

interface IState {
    startYear: number;
    startMonth: number;
    startDay: number;
    endYear: number;
    endMonth: number;
    endDay: number;
    selectedYear: number;
    selectedMonth: number;
    selectedDay: number;
}

export class DropdownDate extends React.Component<IProps, IState> {

    renderParts: any;

    constructor(props: IProps) {
        super(props);
        const { startDate, endDate, selectedDate } = props;
        const sDate = startDate ? new Date(startDate) : new Date('1900-01-01');
        const eDate = endDate ? new Date(endDate) : new Date();
        const selDate = selectedDate ? new Date(selectedDate) : null;
        this.state = {
            startYear: sDate.getFullYear(),
            startMonth: sDate.getMonth(),
            startDay: sDate.getDate(),
            endYear: eDate.getFullYear(),
            endMonth: eDate.getMonth(),
            endDay: eDate.getDate(),
            selectedYear: selDate ? selDate.getFullYear() : -1,
            selectedMonth: selDate ? selDate.getMonth() : -1,
            selectedDay: selDate ? selDate.getDate() : -1
        };
        this.renderParts = {
            year: this.renderYear,
            month: this.renderMonth,
            day: this.renderDay,
        }
    }

    static getDerivedStateFromProps(nextProps: IProps, prevState: IState) {
        const selDate = nextProps.selectedDate ? new Date(nextProps.selectedDate) : null;
        const tempSelDate = {
            selectedYear: selDate ? selDate.getFullYear() : -1,
            selectedMonth: selDate ? selDate.getMonth() : -1,
            selectedDay: selDate ? selDate.getDate() : -1
        };
        if (tempSelDate.selectedYear !== prevState.selectedYear) {
            return { selectedYear: tempSelDate.selectedYear };
        }
        if (tempSelDate.selectedMonth !== prevState.selectedMonth) {
            return { selectedMonth: tempSelDate.selectedMonth };
        }
        if (tempSelDate.selectedDay !== prevState.selectedDay) {
            return { selectedDay: tempSelDate.selectedDay };
        }
        return null;
    }

    generateYearOptions() {
        const { classes, options, defaultValues } = this.props;
        const { startYear, endYear } = this.state;
        const yearOptions = [];
        if (defaultValues && defaultValues.year) {
            yearOptions.push(
                <option key={-1} value="-1"
                    className={(classes && classes.yearOptions) ? classes.yearOptions : undefined}
                >{defaultValues.year}</option>
            );
        }

        if (options && options.yearReverse) {
            for (let i = endYear; i >= startYear; i--) {
                yearOptions.push(
                    <option key={i} value={i}
                        className={(classes && classes.yearOptions) ? classes.yearOptions : undefined}
                    >{i}</option>
                );
            }
        } else {
            for (let i = startYear; i <= endYear; i++) {
                yearOptions.push(
                    <option key={i} value={i}
                        className={(classes && classes.yearOptions) ? classes.yearOptions : undefined}
                    >{i}</option>
                );
            }
        }
        return yearOptions;
    }

    generateMonthOptions() {
        const { classes, options, defaultValues } = this.props;
        let months = [];
        for (let i = 0; i <= 11; i++) {
            months.push({
                value: i,
                month: monthByNumber[i]
            });
        }

        if (options && options.monthShort) {
            months = months.map((elem) => {
                return {
                    value: elem.value,
                    month: elem.month.substring(0, 3)
                };
            });
        }

        if (options && options.monthCaps) {
            months = months.map((elem) => {
                return {
                    value: elem.value,
                    month: elem.month.toUpperCase()
                };
            });
        }

        const monthOptions = [];
        if (defaultValues && defaultValues.month) {
            monthOptions.push(
                <option key={-1} value="-1"
                    className={(classes && classes.monthOptions) ? classes.monthOptions : undefined}
                >{defaultValues.month}</option>
            );
        }
        months.forEach((elem) => {
            monthOptions.push(
                <option key={elem.value} value={elem.value}
                    className={(classes && classes.monthOptions) ? classes.monthOptions : undefined}
                >{elem.month}</option>
            );
        });

        return monthOptions;
    }

    generateDayOptions() {
        const { classes, defaultValues } = this.props;
        const { selectedYear, selectedMonth } = this.state;
        const dayOptions = [];
        if (defaultValues && defaultValues.day) {
            dayOptions.push(
                <option key={-1} value="-1"
                    className={(classes && classes.dayOptions) ? classes.dayOptions : undefined}
                >{defaultValues.day}</option>
            );
        }

        const monthDays = getDaysInMonth(selectedMonth, selectedYear);

        for (let i = 1; i <= monthDays; i++) {
            dayOptions.push(
                <option key={i} value={i}
                    className={(classes && classes.dayOptions) ? classes.dayOptions : undefined}
                >{i}</option>
            );
        }
        return dayOptions;
    }

    handleDateChange = (type: DropdownComponent, value: number) => {
        if (this.props.onDateChange && !isNaN(value)) {
            let { selectedYear, selectedMonth, selectedDay } = this.state;
            if (type === DropdownComponent.year) {
                selectedYear = value;
            } else if (type === DropdownComponent.month) {
                selectedMonth = value;
            } else if (type === DropdownComponent.day) {
                selectedDay = value;
            }

            const monthDays = getDaysInMonth(selectedMonth, selectedYear);
            if (selectedDay > monthDays) {
                selectedDay = monthDays;
            }

            if (selectedYear !== -1 && selectedMonth !== -1 && selectedDay !== -1) {
                this.props.onDateChange(new Date(selectedYear, selectedMonth, selectedDay));
            }
        }
    }

    handleYearChange = (e: any) => {
        const year = parseInt(e.target.value);
        this.setState({ selectedYear: year });
        if (this.props.onYearChange) { this.props.onYearChange(year); }
        this.handleDateChange(DropdownComponent.year, year);
    }

    handleMonthChange = (e: any) => {
        const month = parseInt(e.target.value);
        this.setState({ selectedMonth: month });
        if (this.props.onMonthChange) { this.props.onMonthChange(monthByNumber[month]); }
        this.handleDateChange(DropdownComponent.month, month);
    }

    handleDayChange = (e: any) => {
        const day = parseInt(e.target.value);
        this.setState({ selectedDay: day });
        if (this.props.onDayChange) { this.props.onDayChange(day); }
        this.handleDateChange(DropdownComponent.day, day);
    }

    renderYear = () => {
        const { classes, ids, names } = this.props;
        return (
            <div
                key="year"
                id="dropdown-year"
                className={(classes && classes.yearContainer) ? classes.yearContainer : undefined}
            >
                <select
                    id={(ids && ids.year) ? ids.year : undefined}
                    name={(names && names.year) ? names.year : undefined}
                    className={(classes && classes.year) ? classes.year : undefined}
                    onChange={this.handleYearChange}
                    value={this.state.selectedYear}
                >
                    {this.generateYearOptions()}
                </select>
            </div>
        )
    }

    renderMonth = () => {
        const { classes, ids, names } = this.props;
        return (
            <div
                key="month"
                id="dropdown-month"
                className={(classes && classes.monthContainer) ? classes.monthContainer : undefined}
            >
                <select
                    id={(ids && ids.month) ? ids.month : undefined}
                    name={(names && names.month) ? names.month : undefined}
                    className={(classes && classes.month) ? classes.month : undefined}
                    onChange={this.handleMonthChange}
                    value={this.state.selectedMonth}
                >
                    {this.generateMonthOptions()}
                </select>
            </div>
        )
    }

    renderDay = () => {
        const { classes, ids, names } = this.props;
        return (
            <div
                key="day"
                id="dropdown-day"
                className={(classes && classes.dayContainer) ? classes.dayContainer : undefined}
            >
                <select
                    id={(ids && ids.day) ? ids.day : undefined}
                    name={(names && names.day) ? names.day : undefined}
                    className={(classes && classes.day) ? classes.day : undefined}
                    onChange={this.handleDayChange}
                    value={this.state.selectedDay}
                >
                    {this.generateDayOptions()}
                </select>
            </div>
        )
    }

    render = () => {
        const { classes } = this.props;
        let { order } = this.props;
        order = order || [DropdownComponent.year, DropdownComponent.month, DropdownComponent.day];
        return (
            <div
                id="dropdown-date"
                className={(classes && classes.dateContainer) ? classes.dateContainer : undefined}>
                {order.map(part => {
                    return this.renderParts[part]()
                })}
            </div>
        );
    }
}
