import React, { useState, useEffect } from 'react';
import CalendarView from './CalendarView';
// Import data - ensure allStates is also exported from holidays.js
import { holidaysV25, holidaysV26, allStates as originalAllStates } from '../data/holidays';

// Add "All States" to the list for the UI
const statesForFilter = ['All States', 'National', ...originalAllStates];

function HolidayCalendar({ selectedYear, onYearChange }) {
    const holidayData = selectedYear === '2026' ? holidaysV26 : holidaysV25;

    // --- FILTER STATES ---
    const [selectedType, setSelectedType] = useState('All'); // 'All', 'Public', 'School'
    // Default to 'All States'
    const [selectedStates, setSelectedStates] = useState(['All States']);
    const [selectedGroup, setSelectedGroup] = useState('kumpulanB'); // 'kumpulanA', 'kumpulanB'
    const [showStateSelector, setShowStateSelector] = useState(false);

    // --- VIEW STATE ---
    const [viewMode, setViewMode] = useState('calendar'); // 'calendar', 'list'

    // Reset filters when the year changes
    useEffect(() => {
        setSelectedType('All');
        setSelectedStates(['All States']); // Reset to 'All States'
        setSelectedGroup('kumpulanB');
        setViewMode('calendar');
        setShowStateSelector(false);
    }, [selectedYear]);

    // --- FILTER LOGIC ---
    const filteredHolidays = () => {
        let holidaysToDisplay = [];

        // 1. Filter by Type (All, Public, School)
        if (selectedType === 'All') {
            holidaysToDisplay = [
                ...(holidayData.public || []),
                ...(holidayData.school.kumpulanA || []),
                ...(holidayData.school.kumpulanB || [])
            ];
        } else if (selectedType === 'Public') {
            holidaysToDisplay = [...(holidayData.public || [])];
        } else if (selectedType === 'School') {
            holidaysToDisplay = [
                ...(holidayData.school.kumpulanA || []),
                ...(holidayData.school.kumpulanB || [])
            ];
        }

        // 2. Filter by State/Region (Applies mainly to Public Holidays)
        // Skip state filtering if 'All States' is selected
        if (!selectedStates.includes('All States') && (selectedType === 'Public' || selectedType === 'All')) {
             holidaysToDisplay = holidaysToDisplay.filter(holiday => {
                 // Keep school holidays regardless of state filter for now (filtered by group later)
                 if (!holiday.holiday) return true; // Pass school holidays through

                 // Public Holiday Logic
                 if (holiday.scope === 'National' && selectedStates.includes('National')) {
                     return true;
                 }
                 if (holiday.scope === 'State') {
                     // Simple state match
                     if (Array.isArray(holiday.applicable_states) && holiday.applicable_states.some(state => selectedStates.includes(state))) {
                         return true;
                     }
                      // Handle "National except..."
                     if (typeof holiday.applicable_states === 'string' && holiday.applicable_states.startsWith('National except')) {
                         const excluded = holiday.applicable_states.split('except')[1].split(',').map(s => s.trim());
                         // If 'National' is selected, include if NO selected specific state is excluded
                         if (selectedStates.includes('National')) {
                             return !selectedStates.some(selState => selState !== 'National' && excluded.includes(selState));
                         }
                         // If 'National' isn't selected, include if ANY selected state is NOT excluded
                         else {
                             return selectedStates.some(selState => !excluded.includes(selState));
                         }
                     }
                 }
                 return false; // Exclude if no match
             });
        }


        // 3. Filter by School Group (Only if School type is active)
        if (selectedType === 'School') {
             holidaysToDisplay = holidaysToDisplay.filter(holiday => {
                  // Filter based on the holiday's scope matching the selected group
                  return (selectedGroup === 'kumpulanA' && holiday.scope === 'Kumpulan A') ||
                         (selectedGroup === 'kumpulanB' && holiday.scope === 'Kumpulan B');
             });
        }

        return holidaysToDisplay;
    };

    // --- EVENT HANDLERS ---
    const handleStateSelection = (state) => {
        setSelectedStates(prev => {
            if (state === 'All States') {
                // If 'All States' is clicked, select only it
                return ['All States'];
            }

            // If any other state is clicked
            let newStates = [];
            if (prev.includes('All States')) {
                // If 'All States' was previously selected, start fresh with the clicked state
                newStates = [state];
            } else {
                // Handle multi-select logic for specific states + National
                if (prev.includes(state)) {
                    // Remove state
                    newStates = prev.filter(s => s !== state);
                } else {
                    // Add state
                    newStates = [...prev, state];
                }
            }

            // If the resulting selection is empty, default back to 'All States'
            if (newStates.length === 0) {
                return ['All States'];
            }

            return newStates;
        });
    };


    // --- .ICS Generation (Simplified) ---
    const formatDateForICS = (dateString, isEndOfDay = false) => {
        const cleanedDateString = dateString.replace(/\(.*\)/, '').trim();
        const date = new Date(cleanedDateString);
        if (isNaN(date.getTime())) return null;
        let year = date.getFullYear(); let month = (date.getMonth() + 1).toString().padStart(2, '0'); let day = date.getDate().toString().padStart(2, '0');
        if (isEndOfDay) { const nextDay = new Date(date); nextDay.setDate(date.getDate() + 1); year = nextDay.getFullYear(); month = (nextDay.getMonth() + 1).toString().padStart(2, '0'); day = nextDay.getDate().toString().padStart(2, '0'); }
        return `${year}${month}${day}`;
     };
    const generateIcsContent = (holiday, isReminder = false) => {
        const title = holiday.holiday || holiday.type;
        const description = `Type: ${holiday.holiday ? 'Public Holiday' : 'School Holiday'}\nScope: ${holiday.scope}\nStates: ${Array.isArray(holiday.applicable_states) ? holiday.applicable_states.join(', ') : holiday.applicable_states || 'N/A'}`;
        const uid = `${selectedYear}-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
        let dtStart = ''; let dtEnd = '';
        if (holiday.holiday) { dtStart = formatDateForICS(holiday.date); dtEnd = formatDateForICS(holiday.date, true); }
        else { dtStart = formatDateForICS(holiday.starts); if (holiday.finishes) dtEnd = formatDateForICS(holiday.finishes, true); else dtEnd = formatDateForICS(holiday.starts, true); }
        if (!dtStart || !dtEnd) return null;
        let icsContent = ['BEGIN:VCALENDAR', 'VERSION:2.0', `PRODID:-//cuti-cuti.my//${selectedYear}//EN`, 'CALSCALE:GREGORIAN', 'BEGIN:VEVENT', `UID:${uid}`, `DTSTAMP:${formatDateForICS(new Date().toISOString())}T000000Z`, `DTSTART;VALUE=DATE:${dtStart}`, `DTEND;VALUE=DATE:${dtEnd}`, `SUMMARY:${title} (${selectedYear})`, `DESCRIPTION:${description.replace(/\n/g, '\\n')}`, `LOCATION:Malaysia`, 'STATUS:CONFIRMED', 'SEQUENCE:0', isReminder ? `BEGIN:VALARM\nACTION:DISPLAY\nDESCRIPTION:${title} is coming soon!\nTRIGGER:-P1D\nEND:VALARM` : '', 'END:VEVENT', 'END:VCALENDAR'].filter(Boolean).join('\r\n');
        return icsContent;
    };
    const downloadIcs = (icsContent, filename) => {
        if (!icsContent) { console.error("ICS content generation failed."); return; }
        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' }); const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.setAttribute('download', filename); document.body.appendChild(link); link.click(); document.body.removeChild(link); URL.revokeObjectURL(url);
    };
    const addToCalendar = (holiday) => {
        const icsContent = generateIcsContent(holiday, false);
        if (icsContent) { const filename = `${(holiday.holiday || holiday.type || 'Holiday').replace(/[^a-zA-Z0-9]/g, '_')}_${selectedYear}_${formatDateForICS(holiday.date || holiday.starts)}.ics`; downloadIcs(icsContent, filename); }
    };
    const setReminder = (holiday) => {
        const icsContent = generateIcsContent(holiday, true);
        if (icsContent) { const filename = `${(holiday.holiday || holiday.type || 'Holiday').replace(/[^a-zA-Z0-9]/g, '_')}_REMINDER_${selectedYear}_${formatDateForICS(holiday.date || holiday.starts)}.ics`; downloadIcs(icsContent, filename); }
    };
    const shareHoliday = (holiday) => {
        const text = `Check out this holiday: ${holiday.holiday || holiday.type} on ${holiday.date || holiday.starts}`;
        if (navigator.share) navigator.share({ title: 'Malaysia Holiday', text: text, url: window.location.href }).catch(console.error);
        else navigator.clipboard.writeText(text + ` - Find more at ${window.location.href}`).then(() => alert('Holiday details copied!')).catch(() => alert('Copy failed.'));
    };

    // --- RENDER ---
    const holidaysResult = filteredHolidays(); // Get the filtered list

    return (
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-xl" role="region" aria-labelledby="holiday-calendar-heading">
            
            {/* Filter Controls - Unified Single Line Layout */}
            <div className="mb-6 flex flex-wrap justify-center items-center gap-3 sm:gap-4">

                {/* 1. Type Buttons (All / Public / School) */}
                <div className="flex space-x-1 sm:space-x-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg" role="radiogroup" aria-label="Filter by holiday type">
                    {['All', 'Public', 'School'].map(type => (
                        <button 
                            key={type} 
                            onClick={() => setSelectedType(type)} 
                            className={`px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 ${selectedType === type ? 'bg-white text-purple-700 shadow-sm dark:bg-gray-600 dark:text-white' : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'}`}
                            aria-checked={selectedType === type} 
                            role="radio"
                        >
                            {type === 'All' ? 'All 📅' : type === 'Public' ? 'Public 🏛️' : 'School 🏫'}
                        </button>
                    ))}
                </div>

                {/* 2. State Selector Dropdown */}
                <div className="relative z-10">
                    <button 
                        onClick={() => setShowStateSelector(!showStateSelector)} 
                        className="px-4 py-2 text-sm font-medium rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 flex items-center h-full" 
                        aria-haspopup="true" 
                        aria-expanded={showStateSelector}
                    >
                        {selectedStates.includes('All States') ? 'All States' : `States (${selectedStates.length})`}
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </button>

                    {showStateSelector && (
                        <div className="absolute left-0 mt-1 w-60 max-h-60 overflow-y-auto bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700">
                            <ul className="p-2 space-y-1 text-left">
                                <li>
                                    <label className="flex items-center space-x-2 px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer">
                                        <input type="checkbox" checked={selectedStates.includes('All States')} onChange={() => handleStateSelection('All States')} className="form-checkbox h-4 w-4 text-purple-600 dark:text-purple-500 border-gray-300 dark:border-gray-600 rounded focus:ring-purple-500"/>
                                        <span className="text-sm text-gray-900 dark:text-gray-100 font-bold">All States</span>
                                    </label>
                                </li>
                                <li className="border-t border-gray-200 dark:border-gray-700 my-1"></li>
                                <li>
                                    <label className="flex items-center space-x-2 px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer">
                                        <input type="checkbox" checked={selectedStates.includes('National')} onChange={() => handleStateSelection('National')} disabled={selectedStates.includes('All States')} className={`form-checkbox h-4 w-4 text-purple-600 dark:text-purple-500 border-gray-300 dark:border-gray-600 rounded focus:ring-purple-500 ${selectedStates.includes('All States') ? 'opacity-50 cursor-not-allowed' : ''}`}/>
                                        <span className={`text-sm font-semibold ${selectedStates.includes('All States') ? 'text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-gray-100'}`}>National</span>
                                    </label>
                                </li>
                                {originalAllStates.map(state => (
                                    <li key={state}>
                                        <label className="flex items-center space-x-2 px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer">
                                            <input type="checkbox" checked={selectedStates.includes(state)} onChange={() => handleStateSelection(state)} disabled={selectedStates.includes('All States')} className={`form-checkbox h-4 w-4 text-purple-600 dark:text-purple-500 border-gray-300 dark:border-gray-600 rounded focus:ring-purple-500 ${selectedStates.includes('All States') ? 'opacity-50 cursor-not-allowed' : ''}`}/>
                                            <span className={`text-sm ${selectedStates.includes('All States') ? 'text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-gray-100'}`}>{state}</span>
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* 3. School Group Buttons (Only visible if School is selected) */}
                {selectedType === 'School' && (
                    <div className="flex space-x-1 sm:space-x-2 animate-fade-in">
                        {['kumpulanA', 'kumpulanB'].map(group => (
                            <button key={group} onClick={() => setSelectedGroup(group)} className={`px-3 py-2 text-xs sm:text-sm font-medium rounded-md border focus:outline-none focus:ring-2 focus:ring-purple-500 ${selectedGroup === group ? 'bg-purple-100 border-purple-500 text-purple-700 dark:bg-purple-900 dark:border-purple-400 dark:text-purple-100' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200'}`} aria-checked={selectedGroup === group} role="radio">
                                {group === 'kumpulanA' ? `Kump. A (${selectedYear === '2025' ? 'J,K,K,T' : 'K,K,T'})` : 'Kump. B'}
                            </button>
                        ))}
                    </div>
                )}

                {/* 4. View Mode Toggle */}
                <button 
                    onClick={() => setViewMode(viewMode === 'list' ? 'calendar' : 'list')} 
                    className="px-4 py-2 text-sm font-medium rounded-md bg-purple-600 hover:bg-purple-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 flex items-center"
                    aria-pressed={viewMode === 'calendar'}
                >
                    {viewMode === 'list' ? '🗓️ Calendar' : '📋 List'}
                </button>
            </div>


            {/* Display Area */}
            {viewMode === 'list' ? (
                 <div className="overflow-x-auto" role="table" aria-label={`Holiday List for ${selectedYear}`}>
                     {holidaysResult.length > 0 ? (
                         <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                             <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date/Starts</th>
                                    {(selectedType === 'All' || selectedType === 'Public') && <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden sm:table-cell">Day</th>}
                                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Holiday / Type</th>
                                     {(selectedType === 'All' || selectedType === 'School') && <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden md:table-cell">Finishes</th>}
                                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden lg:table-cell">Scope/States</th>
                                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                             <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {holidaysResult.map((holiday, index) => (
                                    <tr key={`${holiday.date || holiday.starts}-${index}`} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{holiday.date || holiday.starts}</td>
                                         {(selectedType === 'All' || selectedType === 'Public') && <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 hidden sm:table-cell">{holiday.day || '-'}</td>}
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{holiday.holiday || holiday.type}</td>
                                         {(selectedType === 'All' || selectedType === 'School') && <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 hidden md:table-cell">{holiday.finishes || '-'}</td>}
                                         <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 hidden lg:table-cell max-w-xs truncate">{holiday.scope === 'National' ? 'National' : Array.isArray(holiday.applicable_states) ? holiday.applicable_states.join(', ') : holiday.applicable_states || 'N/A'}</td>
                                         <td className="px-4 py-4 whitespace-nowrap text-sm font-medium space-x-2 flex items-center">
                                            <button onClick={() => addToCalendar(holiday)} className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-600" title="Add to Calendar">📅</button>
                                            <button onClick={() => setReminder(holiday)} className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-600" title="Set Reminder">⏰</button>
                                             <button onClick={() => shareHoliday(holiday)} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-600" title="Share">🔗</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                         <p className="text-center text-gray-600 dark:text-gray-400 py-8">No holidays match the selected filters for {selectedYear}.</p>
                    )}
                </div>
            ) : (
                <CalendarView
                    holidays={holidaysResult}
                    selectedYear={selectedYear}
                    onYearChange={onYearChange}
                />
            )}

            {/* Footer Note */}
             <p className="mt-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                Holiday data based on official sources for {selectedYear}. School holidays follow KPM calendar ({selectedYear === '2026' ? 'Year 2026' : 'Session 2025/2026'}).
                 {selectedYear === '2025' && <span> Kump. A: Johor, Kedah, Kelantan, Terengganu.</span>}
                 {selectedYear === '2026' && <span> Kump. A: Kedah, Kelantan, Terengganu.</span>}
                Kump. B: Other states.
            </p>
        </div>
    );
}

export default HolidayCalendar;