import React, { useState, useEffect } from 'react';

function CalendarView({ holidays, holidayType, selectedState }) {
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [showModal, setShowModal] = useState(false);
    const [modalHolidays, setModalHolidays] = useState([]);
    const [modalDate, setModalDate] = useState(null);

    // Function to get the number of days in a month
    const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();

    // Function to get the first day of the month (0 = Sunday, 6 = Saturday)
    const firstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

    // Generate days for the current month view
    const generateCalendarDays = () => {
        const numDays = daysInMonth(currentMonth, currentYear);
        const firstDay = firstDayOfMonth(currentMonth, currentYear);
        const days = [];

        // Fill leading empty days (placeholders for previous month's days)
        for (let i = 0; i < firstDay; i++) {
            days.push({ date: null, isPlaceholder: true });
        }

        // Fill current month's days
        for (let i = 1; i <= numDays; i++) {
            days.push({ date: new Date(currentYear, currentMonth, i), isPlaceholder: false });
        }

        return days;
    };

    const getHolidayDetailsForDate = (date) => {
        const matchingHolidays = [];
        const targetDate = date.toDateString();

        // Check public holidays
        holidays.filter(h => h.holiday).forEach(holiday => { // Filter to ensure it's a public holiday structure
            const holidayDate = new Date(holiday.date.replace(/\(.*\)/, '').trim()).toDateString(); // Clean date string
            if (holidayDate === targetDate) {
                matchingHolidays.push({ name: holiday.holiday, type: 'public', states: holiday.states });
            }
        });

        // Check school holidays
        holidays.filter(h => h.type && h.starts).forEach(holiday => { // Filter to ensure it's a school holiday structure
            const startDate = new Date(holiday.starts.replace(/\(.*\)/, '').trim());
            const endDate = holiday.finishes ? new Date(holiday.finishes.replace(/\(.*\)/, '').trim()) : startDate;

            if (date >= startDate && date <= endDate) {
                // Prevent duplicate entries if a public holiday is also a school holiday, or if school holiday spans multiple days
                const exists = matchingHolidays.some(mh => mh.name === holiday.type && mh.type === 'school');
                if (!exists) {
                    matchingHolidays.push({ name: holiday.type, type: 'school', states: holiday.states });
                }
            }
        });
        return matchingHolidays;
    };


    const goToPreviousMonth = () => {
        setCurrentMonth(prev => (prev === 0 ? 11 : prev - 1));
        if (currentMonth === 0) {
            setCurrentYear(prev => prev - 1);
        }
    };

    const goToNextMonth = () => {
        setCurrentMonth(prev => (prev === 11 ? 0 : prev + 1));
        if (currentMonth === 11) {
            setCurrentYear(prev => prev + 1);
        }
    };

    const handleDateClick = (date) => {
        const holidaysOnThisDay = getHolidayDetailsForDate(date);
        if (holidaysOnThisDay.length > 0) {
            setModalHolidays(holidaysOnThisDay);
            setModalDate(date);
            setShowModal(true);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setModalHolidays([]);
        setModalDate(null);
    };

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]; // For calendar header

    const calendarDays = generateCalendarDays();

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl" role="application" aria-label="Holiday Calendar">
            <div className="flex justify-between items-center mb-4" role="navigation" aria-label="Month navigation">
                <button
                    onClick={goToPreviousMonth}
                    className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                    aria-label="Previous month"
                >
                    &lt; Prev
                </button>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100" aria-live="polite">
                    {monthNames[currentMonth]} {currentYear}
                </h3>
                <button
                    onClick={goToNextMonth}
                    className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                    aria-label="Next month"
                >
                    Next &gt;
                </button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center font-bold text-sm mb-2" role="rowgroup">
                {dayNames.map(day => (
                    <div key={day} className="text-gray-700 dark:text-gray-300 p-2 border-b border-gray-200 dark:border-gray-700" role="columnheader">{day}</div>
                ))}
            </div>

            {/* Calendar Grid: Adjusted for wider cells on mobile */}
            <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, index) => {
                    if (day.isPlaceholder) {
                        return <div key={`placeholder-${index}`} className="p-2 bg-gray-100 dark:bg-gray-700 rounded h-28 sm:h-20"></div>; {/* Increased height for touch */}
                    }

                    const today = new Date();
                    const isToday = day.date.toDateString() === today.toDateString();
                    const holidaysOnThisDay = getHolidayDetailsForDate(day.date);

                    let dayClasses = "p-2 rounded text-gray-900 dark:text-gray-100 flex flex-col items-center justify-center h-28 sm:h-20 relative"; // Increased height
                    
                    // Add cursor-pointer only if there are holidays to click
                    if (holidaysOnThisDay.length > 0) {
                        dayClasses += " cursor-pointer";
                    } else {
                        // Slight gradient/color for non-holiday days to differentiate
                        dayClasses += " bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600";
                    }

                    if (isToday) {
                        dayClasses += " border-2 border-purple-500 dark:border-purple-400";
                    }

                    // Determine holiday types present for icon and cell background
                    const publicHolidaysOnDay = holidaysOnThisDay.filter(h => h.type === 'public');
                    const schoolHolidaysOnDay = holidaysOnThisDay.filter(h => h.type === 'school');

                    let holidayIcon = null; // Default no icon
                    let holidayCellBgClass = ""; // For the main cell background color

                    // Logic for icons based on holiday type and selectedState
                    if (selectedState !== 'All Public Holidays') { // Icons are only shown if selectedState is NOT 'All Public Holidays'
                        const hasPureNationalPublic = publicHolidaysOnDay.some(h => h.states === 'National' && !h.states.includes('except'));
                        const hasStateSpecificPublic = publicHolidaysOnDay.some(h => {
                            const statesParts = h.states.split(',').map(s => s.trim());
                            return statesParts.includes(selectedState) && !h.states.includes('National');
                        });
                        // A holiday is "National with Exclusion" if it's a national holiday but has an 'except' clause
                        const hasNationalWithExclusion = publicHolidaysOnDay.some(h => h.states.includes('National') && h.states.includes('except'));


                        if (publicHolidaysOnDay.length > 0 && schoolHolidaysOnDay.length > 0) {
                            // Case: Both Public (any type) AND School Holidays
                            holidayIcon = '🏛️'; // Building icon for both public and school
                            holidayCellBgClass = "bg-gradient-to-br from-orange-500 to-green-500 text-white"; // Orange to green gradient
                        } else if (schoolHolidaysOnDay.length > 0) {
                            // Case: Only School Holiday
                            holidayIcon = '🚌'; // School bus icon
                            holidayCellBgClass = "bg-green-500 text-white";
                        } else if (publicHolidaysOnDay.length > 0) {
                            // Case: Only Public Holidays (need to differentiate National, State, Mixed Public)
                            if (hasPureNationalPublic && !hasStateSpecificPublic && !hasNationalWithExclusion) {
                                // Pure National Holiday
                                holidayIcon = '🏝️'; // Island icon
                                holidayCellBgClass = "bg-orange-500 text-white"; // Orange for public holidays
                            } else if (hasStateSpecificPublic && !hasPureNationalPublic && !hasNationalWithExclusion) {
                                // Pure State Holiday
                                holidayIcon = '🏛️'; // Building icon for pure state
                                holidayCellBgClass = "bg-orange-500 text-white"; // Orange for public holidays
                            } else {
                                // Mixed Public Holidays (National + State, or National with Exclusion)
                                holidayIcon = '🗓️'; // Calendar icon for mixed public types
                                holidayCellBgClass = "bg-orange-500 text-white"; // Orange for public holidays
                            }
                        }
                    } else {
                        // If 'All Public Holidays' is selected, only apply background colors but no icons
                        if (publicHolidaysOnDay.length > 0 && schoolHolidaysOnDay.length > 0) {
                            holidayCellBgClass = "bg-gradient-to-br from-orange-500 to-green-500 text-white";
                        } else if (publicHolidaysOnDay.length > 0) {
                            holidayCellBgClass = "bg-orange-500 text-white";
                        } else if (schoolHolidaysOnDay.length > 0) {
                            holidayCellBgClass = "bg-green-500 text-white";
                        }
                    }


                    if (holidayCellBgClass) {
                        dayClasses += ` ${holidayCellBgClass} shadow-md`;
                    }

                    return (
                        <div
                            key={day.date.toISOString()}
                            className={dayClasses}
                            role="gridcell"
                            aria-label={`${day.date.toDateString()}. ${holidaysOnThisDay.length > 0 ? 'Holidays present. Click for details.' : 'No holidays.'}`}
                            onClick={holidaysOnThisDay.length > 0 ? () => handleDateClick(day.date) : undefined}
                        >
                            <span className="font-bold text-lg">{day.date.getDate()}</span>
                            {holidayIcon && (
                                <span className="absolute bottom-1 right-1 text-3xl" aria-hidden="true" title="Holiday Present">
                                    {holidayIcon}
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>
            {/* Legend for colors and icons */}
            <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm" role="group" aria-label="Holiday type legend">
                <div className="flex items-center">
                    <span className="inline-block w-4 h-4 bg-orange-500 rounded-full mr-2" aria-hidden="true"></span>
                    <span className="text-gray-700 dark:text-gray-300">National Holiday 🏝️</span>
                </div>
                <div className="flex items-center">
                    <span className="inline-block w-4 h-4 bg-green-500 rounded-full mr-2" aria-hidden="true"></span>
                    <span className="text-gray-700 dark:text-gray-300">School Holiday 🚌</span>
                </div>
                {/* New Mixed Holidays entry */}
                <div className="flex items-center">
                    <span className="inline-block w-4 h-4 bg-orange-500 rounded-full mr-2" aria-hidden="true"></span> {/* Orange swatch for public holiday base */}
                    <span className="text-gray-700 dark:text-gray-300">State Holiday 🏛️</span>
                </div>
                <div className="flex items-center">
                    <span className="inline-block w-4 h-4 bg-gradient-to-br from-orange-500 to-green-500 rounded-full mr-2" aria-hidden="true"></span>
                    <span className="text-gray-700 dark:text-gray-300">Mixed Holidays 🗓️</span>
                </div>
                <div className="flex items-center">
                    <span className="inline-block w-4 h-4 border-2 border-purple-500 rounded-full mr-2" aria-hidden="true"></span>
                    <span className="text-gray-700 dark:text-gray-300">Today</span>
                </div>
            </div>

            {/* Holiday Details Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="modal-title">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md relative">
                        <h4 id="modal-title" className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                            Holidays on {modalDate?.toLocaleDateString('en-MY', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </h4>
                        <button
                            onClick={closeModal}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            aria-label="Close holiday details"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                        <div className="space-y-3">
                            {modalHolidays.map((holiday, index) => (
                                <div key={index} className="p-3 rounded-md bg-gray-100 dark:bg-gray-700">
                                    <p className="font-semibold text-gray-900 dark:text-gray-100">{holiday.name}</p>
                                    {/* Conditionally render Type: School Holiday */}
                                    {holiday.type === 'school' && (
                                        <p className="text-sm text-gray-700 dark:text-gray-300">Type: School Holiday</p>
                                    )}
                                    <p className="text-sm text-gray-700 dark:text-gray-300">States: {holiday.states || 'N/A'}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CalendarView;