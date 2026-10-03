import React, { useState, useEffect } from 'react';
import { supportedYears } from '../data/holidays';

const minYear = parseInt(supportedYears[0], 10);
const maxYear = parseInt(supportedYears[supportedYears.length - 1], 10);

// Accept onYearChange prop for updating the main year state in App.js
function CalendarView({ holidays, selectedYear, onYearChange }) {
    const initialYear = selectedYear ? parseInt(selectedYear, 10) : new Date().getFullYear();
    // Start at Jan if the initial year prop is different from the current real year
    const initialMonth = (initialYear !== new Date().getFullYear()) ? 0 : new Date().getMonth();
    const [currentMonth, setCurrentMonth] = useState(initialMonth);
    const [currentYear, setCurrentYear] = useState(initialYear);
    const [showModal, setShowModal] = useState(false);
    const [modalHolidays, setModalHolidays] = useState([]);
    const [modalDate, setModalDate] = useState(null);

    // Sync internal state ONLY when the external selectedYear prop changes
    useEffect(() => {
        const newYearProp = parseInt(selectedYear, 10);
        // Only update if the prop is different from the internal state year
        if (newYearProp !== currentYear) {
            setCurrentYear(newYearProp);
            // Reset to January ONLY when the EXTERNAL prop forces the year change
            setCurrentMonth(0);
        }
        // If the prop year IS the same as internal, DON'T reset the month.
        // This allows internal navigation memory within the selected year's context.

    }, [selectedYear]); // Dependency ONLY on the prop from App.js

    // Helper to normalize a date to midnight for comparison
    const normalizeDate = (date) => {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        return d;
    };

    // Date calculations
    const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

    // Generate calendar days
    const generateCalendarDays = () => {
        const numDays = daysInMonth(currentMonth, currentYear);
        const firstDay = firstDayOfMonth(currentMonth, currentYear);
        const days = [];
        for (let i = 0; i < firstDay; i++) days.push({ date: null, isPlaceholder: true });
        for (let i = 1; i <= numDays; i++) days.push({ date: new Date(currentYear, currentMonth, i), isPlaceholder: false });
        return days;
    };

    // Get holiday details for a specific date using the passed (already filtered) holidays
    const getHolidayDetailsForDate = (date) => {
        const matchingHolidays = [];
        const calendarDate = normalizeDate(date);
        const holidaysToCheck = holidays || []; // Use the filtered list from props

        holidaysToCheck.forEach(holiday => {
            let startDate, endDate, holidayDate; // Declare variables

             try { // Add error handling for date parsing
                if (holiday.holiday && holiday.date) { // Public/State holiday logic
                    const holidayDateStr = holiday.date.replace(/\(.*\)/, '').trim();
                    holidayDate = normalizeDate(holidayDateStr);
                    
                    if (!isNaN(holidayDate.getTime()) && holidayDate.getTime() === calendarDate.getTime()) {
                        // Determine type based on scope
                        // 'public' = National (Orange), 'state' = State (Blue)
                        const type = (holiday.scope === 'State') ? 'state' : 'public';
                        matchingHolidays.push({ name: holiday.holiday, type: type, states: holiday.applicable_states });
                    }
                } else if (holiday.type && holiday.starts) { // School holiday
                    const startDateStr = holiday.starts.replace(/\(.*\)/, '').trim();
                    const endDateStr = holiday.finishes ? holiday.finishes.replace(/\(.*\)/, '').trim() : startDateStr;

                    startDate = normalizeDate(startDateStr);
                    endDate = normalizeDate(endDateStr);

                    if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
                        if (calendarDate.getTime() >= startDate.getTime() && calendarDate.getTime() <= endDate.getTime()) {
                            const exists = matchingHolidays.some(mh => mh.name === holiday.type && mh.type === 'school');
                            if (!exists) {
                                matchingHolidays.push({ name: holiday.type, type: 'school', states: holiday.scope }); // Use scope for Kumpulan
                            }
                        }
                    } else {
                         console.warn("Invalid date found in school holiday:", holiday);
                    }
                }
             } catch (e) {
                 console.error("Error processing holiday date:", holiday, e);
             }
        });
        return matchingHolidays;
    };

    // --- CORRECTED NAVIGATION LOGIC ---
    const goToPreviousMonth = () => {
        const newMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const newYear = currentMonth === 0 ? currentYear - 1 : currentYear;
        const currentSelectedYear = parseInt(selectedYear, 10); // Year from App state

        // 1. Always update the internal state for immediate UI feedback
        setCurrentMonth(newMonth);
        setCurrentYear(newYear);

        // 2. Conditionally call the callback ONLY if the internal navigation
        //    moves the year *strictly below* the App's currently selected year.
        if (newYear < currentSelectedYear && currentSelectedYear > minYear) { // Ensure we don't go below min year via callback
             // We internally navigated from Jan of selectedYear to Dec of the previous year.
             // Tell the App to switch its main selectedYear.
            onYearChange(newYear.toString());
        }
        // If newYear is >= currentSelectedYear, no callback needed, just internal update.
    };

    const goToNextMonth = () => {
        const newMonth = currentMonth === 11 ? 0 : currentMonth + 1;
        const newYear = currentMonth === 11 ? currentYear + 1 : currentYear;
        const currentSelectedYear = parseInt(selectedYear, 10); // Year from App state

        // 1. Always update the internal state for immediate UI feedback
        setCurrentMonth(newMonth);
        setCurrentYear(newYear);

        // 2. Conditionally call the callback ONLY if the internal navigation
        //    moves the year *strictly above* the App's currently selected year.
        if (newYear > currentSelectedYear && currentSelectedYear < maxYear) { // Ensure we don't go above max year via callback
            // We internally navigated from Dec of selectedYear to Jan of the next year.
            // Tell the App to switch its main selectedYear.
            onYearChange(newYear.toString());
        }
        // If newYear is <= currentSelectedYear, no callback needed, just internal update.
    };
    // --- END CORRECTED NAVIGATION ---


    // Modal handlers...
    const handleDateClick = (date) => { /* ... */
        const holidaysOnThisDay = getHolidayDetailsForDate(date);
        if (holidaysOnThisDay.length > 0) {
            setModalHolidays(holidaysOnThisDay);
            setModalDate(date);
            setShowModal(true);
        }
    };
    const closeModal = () => { /* ... */
        setShowModal(false);
        setModalHolidays([]);
        setModalDate(null);
     };

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    const calendarDays = generateCalendarDays();

    return (
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-xl" role="application" aria-label="Holiday Calendar">
            {/* Header */}
            <div className="flex justify-between items-center mb-4" role="navigation" aria-label="Month navigation">
                 <button onClick={goToPreviousMonth} className={`p-2 rounded-md ${currentYear <= minYear && currentMonth === 0 ? 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600 cursor-not-allowed' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'}`} aria-label="Previous month" disabled={currentYear <= minYear && currentMonth === 0}>
                    &lt; Prev
                </button>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100" aria-live="polite">
                    {monthNames[currentMonth]} {currentYear}
                </h3>
                <button onClick={goToNextMonth} className={`p-2 rounded-md ${currentYear >= maxYear && currentMonth === 11 ? 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600 cursor-not-allowed' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'}`} aria-label="Next month" disabled={currentYear >= maxYear && currentMonth === 11}>
                    Next &gt;
                </button>
            </div>

            {/* Day Headers */}
             <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs sm:text-sm mb-2">
                {dayNames.map(day => ( <div key={day} className="text-gray-700 dark:text-gray-300 p-1 sm:p-2 border-b border-gray-200 dark:border-gray-700" role="columnheader">{day}</div> ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, index) => {
                    if (day.isPlaceholder) {
                        return <div key={`placeholder-${index}`} className="p-1 sm:p-2 bg-gray-100 dark:bg-gray-700 rounded aspect-square"></div>;
                    }
                    const isToday = normalizeDate(day.date).getTime() === normalizeDate(new Date()).getTime();
                    const holidaysOnThisDay = getHolidayDetailsForDate(day.date);
                    
                     let dayClasses = "p-1 sm:p-2 rounded text-gray-900 dark:text-gray-100 flex flex-col items-center justify-center relative aspect-square text-xs sm:text-sm md:text-base";
                     if (holidaysOnThisDay.length > 0) dayClasses += " cursor-pointer transition-transform duration-150 hover:scale-105";
                    else dayClasses += " bg-gray-50 dark:bg-gray-700";
                    if (isToday) dayClasses += " ring-2 ring-purple-500 dark:ring-purple-400 ring-offset-1 dark:ring-offset-gray-800";

                    // --- UPDATED COLOR LOGIC ---
                    const hasNational = holidaysOnThisDay.some(h => h.type === 'public');
                    const hasState = holidaysOnThisDay.some(h => h.type === 'state');
                    const hasSchool = holidaysOnThisDay.some(h => h.type === 'school');

                    let holidayCellBgClass = "";
                    
                    // Priority Logic: Mixed types get Gradients
                    if (hasNational && hasSchool) {
                         holidayCellBgClass = "bg-gradient-to-br from-orange-500 to-green-500 text-white";
                    } else if (hasState && hasSchool) {
                         holidayCellBgClass = "bg-gradient-to-br from-blue-500 to-green-500 text-white"; // Blue + Green
                    } else if (hasNational && hasState) {
                         // If both National and State exist (rare), prioritize National (Orange) or mix them?
                         // Let's treat it as National (Orange) to avoid too many colors, or use a National/State mix.
                         // For now, prioritize National.
                         holidayCellBgClass = "bg-orange-500 text-white";
                    } else if (hasNational) {
                         holidayCellBgClass = "bg-orange-500 text-white";
                    } else if (hasState) {
                         holidayCellBgClass = "bg-blue-500 text-white"; // New Blue Color
                    } else if (hasSchool) {
                         holidayCellBgClass = "bg-green-500 text-white";
                    }
                    
                    if (holidayCellBgClass) dayClasses += ` ${holidayCellBgClass} font-semibold`;

                     return (
                        <div key={day.date.toISOString()} className={dayClasses} role="gridcell" aria-label={`${day.date.toDateString()}. ${holidaysOnThisDay.length > 0 ? holidaysOnThisDay.map(h => h.name).join(', ') : 'No holidays.'}`} onClick={holidaysOnThisDay.length > 0 ? () => handleDateClick(day.date) : undefined} tabIndex={holidaysOnThisDay.length > 0 ? 0 : -1}>
                            <span className="font-bold">{day.date.getDate()}</span>
                        </div>
                    );
                })}
            </div>

            {/* Legend - Updated with State */}
             <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs sm:text-sm">
                 <div className="flex items-center"><span className="inline-block w-3 h-3 sm:w-4 sm:h-4 bg-orange-500 rounded-full mr-1 sm:mr-2"></span><span className="text-gray-700 dark:text-gray-300">Public (National)</span></div>
                 {/* NEW STATE LEGEND ITEM */}
                 <div className="flex items-center"><span className="inline-block w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded-full mr-1 sm:mr-2"></span><span className="text-gray-700 dark:text-gray-300">State</span></div>
                <div className="flex items-center"><span className="inline-block w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full mr-1 sm:mr-2"></span><span className="text-gray-700 dark:text-gray-300">School</span></div>
                <div className="flex items-center"><span className="inline-block w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-br from-orange-500 to-green-500 rounded-full mr-1 sm:mr-2"></span><span className="text-gray-700 dark:text-gray-300">Mixed</span></div>
                <div className="flex items-center"><span className="inline-block w-3 h-3 sm:w-4 sm:h-4 ring-2 ring-purple-500 rounded-full mr-1 sm:mr-2"></span><span className="text-gray-700 dark:text-gray-300">Today</span></div>
            </div>

            {/* Modal */}
            {showModal && (
                 <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="modal-title">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md relative">
                        <h4 id="modal-title" className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Holidays on {modalDate?.toLocaleDateString('en-MY', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h4>
                        <button onClick={closeModal} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" aria-label="Close holiday details"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
                        <div className="space-y-3 max-h-60 overflow-y-auto">
                            {modalHolidays.map((holiday, index) => (
                                <div key={index} className="p-3 rounded-md bg-gray-100 dark:bg-gray-700">
                                    <p className="font-semibold text-gray-900 dark:text-gray-100">{holiday.name}</p>
                                    {holiday.type === 'school' && (<p className="text-sm text-gray-700 dark:text-gray-300">Type: School Holiday ({holiday.states})</p>)}
                                    {/* Update Modal Text for new types */}
                                     {holiday.type === 'public' && (<p className="text-sm text-gray-700 dark:text-gray-300">Type: National Holiday (Public)</p>)}
                                     {holiday.type === 'state' && (<p className="text-sm text-gray-700 dark:text-gray-300">Type: State Holiday ({Array.isArray(holiday.states) ? holiday.states.join(', ') : holiday.states})</p>)}
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