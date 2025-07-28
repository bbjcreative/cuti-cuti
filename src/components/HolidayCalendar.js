import React, { useState } from 'react';
import CalendarView from './CalendarView';

function HolidayCalendar() {
    // Version 23 of Holiday Data - Cleaned and ready for display
    const holidaysV23 = {
        public: [
            { date: '1 Jan 2025', day: 'Wed', holiday: "New Year's Day", states: "National except Johor, Kedah, Kelantan, Perlis & Terengganu" },
            { date: '14 Jan 2025', day: 'Tue', holiday: "YDPB Negeri Sembilan's Birthday", states: "Negeri Sembilan" },
            { date: '27 Jan 2025', day: 'Mon', holiday: "Israk and Mikraj", states: "Kedah, Negeri Sembilan, Perlis & Terengganu" },
            { date: '29 Jan 2025', day: 'Wed', holiday: "Chinese New Year", states: "National" },
            { date: '30 Jan 2025', day: 'Thu', holiday: "Chinese New Year Holiday", states: "National" },
            { date: '1 Feb 2025', day: 'Sat', holiday: "Federal Territory Day", states: "Kuala Lumpur, Labuan & Putrajaya" },
            { date: '11 Feb 2025', day: 'Tue', holiday: "Thaipusam", states: "Johor, Kedah, Kuala Lumpur, Negeri Sembilan, Penang, Perak, Putrajaya & Selangor" },
            { date: '20 Feb 2025', day: 'Thu', holiday: "Independence Declaration Day", states: "Melaka" },
            { date: '2 Mar 2025', day: 'Sun', holiday: "Awal Ramadan", states: "Johor & Kedah" },
            { date: '3 Mar 2025', day: 'Mon', holiday: "Awal Ramadan Holiday", states: "Johor" },
            { date: '4 Mar 2025', day: 'Tue', holiday: "Installation of Sultan Terengganu", states: "Terengganu" },
            { date: '18 Mar 2025', day: 'Tue', holiday: "Nuzul Al-Quran", states: "National except Johor, Kedah, Melaka, Negeri Sembilan, Sabah & Sarawak" },
            { date: '23 Mar 2025', day: 'Sun', holiday: "Sultan of Johor's Birthday", states: "Johor" },
            { date: '24 Mar 2025', day: 'Mon', holiday: "Sultan of Johor's Birthday Holiday", states: "Johor" },
            { date: '30 Mar 2025', day: 'Sun', holiday: "Hari Raya Aidilfitri Holiday", states: "Kedah, Kelantan & Terengganu" },
            { date: '30 Mar 2025', day: 'Sun', holiday: "Sabah Governor's Birthday", states: "Sabah" },
            { date: '31 Mar 2025', day: 'Mon', holiday: "Hari Raya Aidilfitri", states: "National" },
            { date: '1 Apr 2025', day: 'Tue', holiday: "Hari Raya Aidilfitri Holiday", states: "National" },
            { date: '2 Apr 2025', day: 'Wed', holiday: "Hari Raya Aidilfitri Holiday", states: "Melaka" },
            { date: '18 Apr 2025', day: 'Fri', holiday: "Good Friday", states: "Sabah & Sarawak" },
            { date: '26 Apr 2025', day: 'Sat', holiday: "Sultan of Terengganu's Birthday", states: "Terengganu" },
            { date: '27 Apr 2025', day: 'Sun', holiday: "Sultan of Terengganu's Birthday Holiday", states: "Terengganu" },
            { date: '28 Apr 2025', day: 'Mon', holiday: "Special Public Holiday", states: "Johor" },
            { date: '1 May 2025', day: 'Thu', holiday: "Labour Day", states: "National" },
            { date: '12 May 2025', day: 'Mon', holiday: "Wesak Day", states: "National" },
            { date: '17 May 2025', day: 'Sat', holiday: "Raja Perlis' Birthday", states: "Perlis" },
            { date: '22 May 2025', day: 'Thu', holiday: "Hari Hol Pahang", states: "Pahang" },
            { date: '30 May 2025', day: 'Fri', holiday: "Harvest Festival", states: "Labuan & Sabah" },
            { date: '31 May 2025', day: 'Sat', holiday: "Harvest Festival Holiday", states: "Labuan & Sabah" },
            { date: '1 Jun 2025', day: 'Sun', holiday: "Hari Gawai", states: "Sarawak" },
            { date: '2 Jun 2025', day: 'Mon', holiday: "Hari Gawai Holiday", states: "Sarawak" },
            { date: '2 Jun 2025', day: 'Mon', holiday: "Agong's Birthday", states: "National" },
            { date: '3 Jun 2025', day: 'Tue', holiday: "Agong's Birthday Holiday", states: "Sarawak" },
            { date: '6 Jun 2025', day: 'Fri', holiday: "Arafat Day", states: "Kelantan & Terengganu" },
            { date: '7 Jun 2025', day: 'Sat', holiday: "Hari Raya Haji", states: "National" },
            { date: '8 Jun 2025', day: 'Sun', holiday: "Hari Raya Haji Holiday", states: "Kedah, Kelantan, Perlis & Terengganu" },
            { date: '9 Jun 2025', day: 'Mon', holiday: "Hari Raya Haji Holiday", states: "Kelantan, Perlis & Terengganu" },
            { date: '22 Jun 2025', day: 'Sun', holiday: "Sultan of Kedah's Birthday", states: "Kedah" },
            { date: '27 Jun 2025', day: 'Fri', holiday: "Awal Muharram", states: "National" },
            { date: '29 Jun 2025', day: 'Sun', holiday: "Awal Muharram Holiday", states: "Kedah" },
            { date: '7 Jul 2025', day: 'Mon', holiday: "Georgetown World Heritage City Day", states: "Penang" },
            { date: '12 Jul 2025', day: 'Sat', holiday: "Penang Governor's Birthday", states: "Penang" },
            { date: '22 Jul 2025', day: 'Tue', holiday: "Sarawak Day", states: "Sarawak" },
            { date: '30 Jul 2025', day: 'Wed', holiday: "Sultan of Pahang's Birthday", states: "Pahang" },
            { date: '31 Jul 2025', day: 'Thu', holiday: "Hari Hol Almarhum Sultan Iskandar", states: "Johor" },
            { date: '24 Aug 2025', day: 'Sun', holiday: "Melaka Governor's Birthday", states: "Melaka" },
            { date: '25 Aug 2025', day: 'Mon', holiday: "Melaka Governor's Birthday Holiday", states: "Melaka" },
            { date: '31 Aug 2025', day: 'Sun', holiday: "Merdeka Day", states: "National" },
            { date: '1 Sep 2025', day: 'Mon', holiday: "Merdeka Day Holiday", states: "National except Kedah, Kelantan & Terengganu" },
            { date: '5 Sep 2025', day: 'Fri', holiday: "Prophet Muhammad's Birthday", states: "National" },
            { date: '7 Sep 2025', day: 'Sun', holiday: "Prophet Muhammad's Birthday Holiday", states: "Kedah" },
            // Added new holiday here
            { date: '15 Sep 2025', day: 'Mon', holiday: "Malaysia Day Special Holiday", states: "National" },
            { date: '16 Sep 2025', day: 'Tue', holiday: "Malaysia Day", states: "National" },
            { date: '29 Sep 2025', day: 'Mon', holiday: "Sultan of Kelantan's Birthday", states: "Kelantan" },
            { date: '30 Sep 2025', day: 'Tue', holiday: "Sultan of Kelantan's Birthday Holiday", states: "Kelantan" },
            { date: '11 Oct 2025', day: 'Sat', holiday: "Sarawak Governor's Birthday", states: "Sarawak" },
            { date: '20 Oct 2025', day: 'Mon', holiday: "Deepavali", states: "National except Sarawak" },
            { date: '7 Nov 2025', day: 'Fri', holiday: "Sultan of Perak's Birthday", states: "Perak" },
            { date: '11 Dec 2025', day: 'Thu', holiday: "Sultan of Selangor's Birthday", states: "Selangor" },
            { date: '24 Dec 2025', day: 'Wed', holiday: "Christmas Eve", states: "Sabah" },
            { date: '25 Dec 2025', day: 'Thu', holiday: "Christmas Day", states: "National" },
        ].filter(Boolean),
        school: {
            kumpulanA: [ // Kedah, Kelantan, Terengganu
                { type: "First Day of School", starts: "16 Feb 2025(Sun)", finishes: "" },
                { type: "Term 1 Holidays", starts: "29 May 2025(Thu)", finishes: "9 Jun 2025(Mon)" },
                { type: "Term 2 Holidays", starts: "12 Sep 2025(Fri)", finishes: "20 Sep 2025(Sat)" },
                { type: "End of School Year Holidays", starts: "19 Dec 2025(Fri)", finishes: "10 Jan 2026(Sat)" },
                { type: "Hari Raya Aidilfitri Holidays", starts: "30 Mar 2025(Sun)", finishes: "3 Apr 2025(Thu)", states: "Kumpulan A" },
                { type: "Deepavali Holidays", starts: "19 Oct 2025(Sun)", finishes: "21 Oct 2025(Tue)", states: "Kumpulan A" },
            ].filter(Boolean),
            kumpulanB: [ // Johor, Kuala Lumpur, Labuan, Melaka, Negeri Sembilan, Pahang, Perlis, Penang, Perak, Putrajaya, Sabah, Sarawak, Selangor
                { type: "First Day of School", starts: "17 Feb 2025(Mon)", finishes: "" },
                { type: "Term 1 Holidays", starts: "29 May 2025(Thu)", finishes: "9 Jun 2025(Mon)" },
                { type: "Term 2 Holidays", starts: "13 Sep 2025(Sat)", finishes: "21 Sep 2025(Sun)" },
                { type: "End of School Year Holidays", starts: "20 Dec 2025(Sat)", finishes: "11 Jan 2026(Sun)" },
                { type: "Hari Raya Aidilfitri Holidays", starts: "31 Mar 2025(Mon)", finishes: "4 Apr 2025(Fri)", states: "Kumpulan B" },
                { type: "Deepavali Holidays", starts: "20 Oct 2025(Mon)", finishes: "22 Oct 2025(Wed)", states: "All States in Kumpulan B except Sarawak" },
                { type: "Deepavali Holidays", starts: "20 Oct 2025(Mon)", finishes: "20 Oct 2025(Mon)", states: "Sarawak" },
            ].filter(Boolean)
        }
    };

    // Define the exact list and order of states for the dropdown
    const orderedStatesList = [
        "Kuala Lumpur", "Selangor", "Penang", "Putrajaya", "Johor", "Melaka",
        "Negeri Sembilan", "Pahang", "Perlis", "Perak", "Labuan", "Sabah",
        "Sarawak", "Kedah", "Kelantan", "Terengganu"
    ];

    // The filterableStates array will now directly use this ordered list
    const filterableStates = ["All Public Holidays", "National", ...orderedStatesList];

    const [selectedType, setSelectedType] = useState('public');
    const [selectedGroup, setSelectedGroup] = useState('kumpulanB');
    const [selectedState, setSelectedState] = useState('All Public Holidays'); // Default to "All Public Holidays"
    const [viewMode, setViewMode] = useState('calendar'); // Default to 'calendar'

    const filteredHolidays = () => {
        let currentHolidays = [];

        if (selectedType === 'public') {
            currentHolidays = holidaysV23.public.filter(holiday => {
                const statesString = holiday.states;
                const isNationalHoliday = statesString.includes('National');
                const excludedStates = isNationalHoliday && statesString.includes('except') ?
                                       statesString.split('except')[1].split(',').map(s => s.trim()) : [];
                const isExcludedFromNational = excludedStates.includes(selectedState);
                const isStateSpecificHoliday = statesString.split(',').map(s => s.trim()).includes(selectedState);

                if (selectedState === 'All Public Holidays') {
                    return true;
                } else if (selectedState === 'National') {
                    return isNationalHoliday && !statesString.includes('except');
                } else {
                    // When a specific state is selected (e.g., "Johor"):
                    // Include if it's a national holiday AND not explicitly excluded for this state
                    // OR if it's a holiday specifically for this state
                    return (isNationalHoliday && !isExcludedFromNational) || isStateSpecificHoliday;
                }
            });
        } else {
            if (selectedGroup === 'kumpulanA') {
                currentHolidays = holidaysV23.school.kumpulanA;
            } else if (selectedGroup === 'kumpulanB') {
                currentHolidays = holidaysV23.school.kumpulanB;
            }
        }
        return currentHolidays;
    };

    // Helper function to format date for iCalendar
    const formatDateForICS = (dateString, isEndOfDay = false) => {
        const cleanedDateString = dateString.replace(/\(.*\)/, '').trim();
        const date = new Date(cleanedDateString);

        if (isNaN(date.getTime())) {
            console.error("Invalid date string for ICS:", dateString);
            return null;
        }

        let year = date.getFullYear();
        let month = (date.getMonth() + 1).toString().padStart(2, '0');
        let day = date.getDate().toString().padStart(2, '0');

        if (isEndOfDay) {
            const nextDay = new Date(date);
            nextDay.setDate(date.getDate() + 1);
            year = nextDay.getFullYear();
            month = (nextDay.getMonth() + 1).toString().padStart(2, '0');
            day = nextDay.getDate().toString().padStart(2, '0');
        }

        return `${year}${month}${day}`;
    };

    const generateIcsContent = (holiday, isReminder = false) => {
        const title = holiday.holiday || holiday.type;
        const description = `Type: ${holiday.holiday ? 'Public Holiday' : 'School Holiday'}\nStates: ${holiday.states || 'N/A'}`;
        const uid = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
        const organizer = 'mailto:info@cuti-cuti.my'; // Updated organizer email

        let dtStart = '';
        let dtEnd = '';

        if (selectedType === 'public') {
            dtStart = formatDateForICS(holiday.date);
            dtEnd = formatDateForICS(holiday.date, true);
        } else {
            dtStart = formatDateForICS(holiday.starts);
            if (holiday.finishes) {
                dtEnd = formatDateForICS(holiday.finishes, true);
            } else {
                dtEnd = formatDateForICS(holiday.starts, true);
            }
        }

        if (!dtStart || !dtEnd) {
            console.error("Failed to generate ICS due to invalid date format.");
            const message = "Could not generate calendar event due to a date formatting issue. Check console for details.";
            const messageBox = document.createElement('div');
            messageBox.textContent = message;
            messageBox.style.cssText = `
                position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                background-color: #f8d7da; color: #721c24; padding: 15px; border-radius: 5px;
                border: 1px solid #f5c6cb; z-index: 1000; font-family: sans-serif;
            `;
            document.body.appendChild(messageBox);
            setTimeout(() => document.body.removeChild(messageBox), 3000);
            return;
        }

        let icsContent = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//cuti-cuti.my//Malaysia Holidays V23.0//EN', // Updated PRODID
            'CALSCALE:GREGORIAN',
            'BEGIN:VEVENT',
            `UID:${uid}`,
            `DTSTAMP:${formatDateForICS(new Date().toISOString(), false)}T000000Z`,
            `DTSTART;VALUE=DATE:${dtStart}`,
            `DTEND;VALUE=DATE:${dtEnd}`,
            `SUMMARY:${title}`,
            `DESCRIPTION:${description}`,
            `LOCATION:Malaysia`,
            'STATUS:CONFIRMED',
            'SEQUENCE:0',
            isReminder ? `BEGIN:VALARM
ACTION:DISPLAY
DESCRIPTION:${title} is coming soon!
TRIGGER:-P1D // 1 day before the event
END:VALARM` : '',
            'END:VEVENT',
            'END:VCALENDAR'
        ].filter(Boolean).join('\n');

        return icsContent;
    };

    const downloadIcs = (icsContent, filename) => {
        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const addToCalendar = (holiday) => {
        const icsContent = generateIcsContent(holiday, false);
        if (icsContent) {
            const filename = `${(holiday.holiday || holiday.type || 'Holiday').replace(/[^a-zA-Z0-9]/g, '_')}_${formatDateForICS(holiday.date || holiday.starts)}.ics`;
            downloadIcs(icsContent, filename);
        }
    };

    const setReminder = (holiday) => {
        const icsContent = generateIcsContent(holiday, true);
        if (icsContent) {
            const filename = `${(holiday.holiday || holiday.type || 'Holiday').replace(/[^a-zA-Z0-9]/g, '_')}_REMINDER_${formatDateForICS(holiday.date || holiday.starts)}.ics`;
            downloadIcs(icsContent, filename);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl" role="region" aria-labelledby="holiday-calendar-heading">
            <h2 id="holiday-calendar-heading" className="sr-only">Holiday Calendar and Filters</h2>
            <div className="mb-6 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <label htmlFor="holiday-type-select" className="sr-only">Select holiday type</label>
                <select
                    id="holiday-type-select"
                    className="p-3 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={selectedType}
                    onChange={(e) => {
                        setSelectedType(e.target.value);
                        if (e.target.value === 'school') {
                            setSelectedGroup('kumpulanB');
                            setSelectedState('');
                        } else {
                            setSelectedGroup('');
                            setSelectedState('All Public Holidays'); // Set default to new label
                        }
                    }}
                >
                    <option value="public">Public Holidays 🏛️</option>
                    <option value="school">School Holidays 🏫</option>
                </select>

                {selectedType === 'school' && (
                    <>
                        <label htmlFor="school-group-select" className="sr-only">Select school group</label>
                        <select
                            id="school-group-select"
                            className="p-3 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            value={selectedGroup}
                            onChange={(e) => setSelectedGroup(e.target.value)}
                        >
                            <option value="">Select School Group</option>
                            <option value="kumpulanA">Kumpulan A (Kedah, Kelantan, Terengganu)</option>
                            <option value="kumpulanB">Kumpulan B (Other States)</option>
                        </select>
                    </>
                )}

                {selectedType === 'public' && (
                    <>
                        <label htmlFor="state-filter-select" className="sr-only">Filter by state</label>
                        <select
                            id="state-filter-select"
                            className="p-3 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            value={selectedState}
                            onChange={(e) => setSelectedState(e.target.value)}
                        >
                            {/* Changed "All States" option label */}
                            {filterableStates.map(state => (
                                <option key={state} value={state}>
                                    {state}
                                </option>
                            ))}
                        </select>
                    </>
                )}

                {/* View Mode Toggle Button - Keep as it is (text and icon) */}
                <button
                    onClick={() => setViewMode(viewMode === 'list' ? 'calendar' : 'list')}
                    className="p-3 border border-gray-300 dark:border-gray-700 rounded-md bg-purple-500 hover:bg-purple-600 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 flex items-center justify-center"
                    aria-pressed={viewMode === 'calendar'}
                    aria-label={`Switch to ${viewMode === 'list' ? 'Calendar View' : 'List View'}`}
                    title={viewMode === 'list' ? 'Switch to Calendar View' : 'Switch to List View'}
                >
                    {viewMode === 'list' ? '🗓️ Calendar View' : '📋 List View'}
                </button>
            </div>

            {viewMode === 'list' ? (
                <div className="overflow-x-auto" role="table" aria-label="Holiday List">
                    {(selectedType === 'public' || (selectedType === 'school' && selectedGroup !== '')) ? (
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Date
                                    </th>
                                    {selectedType === 'public' && (
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Day
                                        </th>
                                    )}
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Holiday / Type
                                    </th>
                                    {selectedType === 'school' && (
                                        <>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Starts
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Finishes
                                            </th>
                                        </>
                                    )}
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        States
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {filteredHolidays().map((holiday, index) => (
                                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                            {selectedType === 'public' ? holiday.date : holiday.starts}
                                        </td>
                                        {selectedType === 'public' && (
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                                {holiday.day}
                                            </td>
                                        )}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                            {holiday.holiday || holiday.type}
                                        </td>
                                        {selectedType === 'school' && (
                                            <>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                                    {holiday.starts}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                                    {holiday.finishes}
                                                </td>
                                            </>
                                        )}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                            {holiday.states || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => addToCalendar(holiday)}
                                                className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-600 mr-4"
                                                title="Add to Calendar"
                                                aria-label={`Add ${holiday.holiday || holiday.type} to calendar`}
                                            >
                                                📅 Add
                                            </button>
                                            <button
                                                onClick={() => setReminder(holiday)}
                                                className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-600"
                                                title="Set Reminder"
                                                aria-label={`Set reminder for ${holiday.holiday || holiday.type}`}
                                            >
                                                ⏰ Remind
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-center text-gray-600 dark:text-gray-400">
                            {selectedType === 'school' ? 'Please select a school group (Kumpulan A or B) to view school holidays.' : 'No holidays to display for the selected options.'}
                        </p>
                    )}
                </div>
            ) : (
                <CalendarView
                    holidays={filteredHolidays()}
                    holidayType={selectedType}
                    selectedState={selectedState}
                />
            )}

            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                School holiday dates for 2025/2026 are official from the MOE website.
                Kumpulan A states: Kedah, Kelantan, Terengganu (Friday & Saturday weekend).
                Kumpulan B states: All other states and territories (Saturday & Sunday weekend).
            </p>
        </div>
    );
}

export default HolidayCalendar;