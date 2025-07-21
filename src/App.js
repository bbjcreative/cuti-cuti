import React, { useState, useEffect } from 'react';
import HolidayCalendar from './components/HolidayCalendar';
import BlogSection from './components/BlogSection';
import CalendarView from './components/CalendarView'; // Ensure this import is correct

function App() {
    const [theme, setTheme] = useState('light'); // For dark/light mode, controlled by local storage for persistence

    useEffect(() => {
        // Check local storage for theme preference
        const savedTheme = localStorage.getItem('theme') || 'light';
        setTheme(savedTheme);
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(savedTheme);
    }, []);

    useEffect(() => {
        // Save theme preference to local storage whenever it changes
        localStorage.setItem('theme', theme);
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    return (
        <>
            <header className="fixed w-full z-10">
                <nav className="bg-white border-gray-200 py-2.5 dark:bg-gray-900">
                    <div className="flex flex-wrap items-center justify-between max-w-screen-xl px-4 mx-auto">
                        <a href="#" className="flex items-center">
                            {/* Replaced Flowbite logo with cuti_cuti_logo.png and made it bigger */}
                            <img src="/images/cuti_cuti_logo.png" className="h-10 mr-3 sm:h-14" alt="cuti-cuti.my Logo" />
                            {/* Removed the text "cuti-cuti.my 🇲🇾" */}
                        </a>
                        <div className="flex items-center lg:order-2">
                            {/* Dark/Light Mode Toggle Switch */}
                            <label className="inline-flex items-center cursor-pointer mr-4">
                                <input
                                    type="checkbox"
                                    value=""
                                    className="sr-only peer"
                                    checked={theme === 'dark'}
                                    onChange={toggleTheme}
                                    aria-label={`Switch to ${theme === 'light' ? 'Dark Mode' : 'Light Mode'}`}
                                />
                                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                                <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                                    {theme === 'light' ? 'Light Mode ☀️' : 'Dark Mode 🌙'}
                                </span>
                            </label>

                            <button data-collapse-toggle="mobile-menu-2" type="button" className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="mobile-menu-2" aria-expanded="false">
                                <span className="sr-only">Open main menu</span>
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
                                <svg className="hidden w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                            </button>
                        </div>
                        <div className="items-center justify-between hidden w-full lg:flex lg:w-auto lg:order-1" id="mobile-menu-2">
                            <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
                                <li>
                                    <a href="#holidays" className="block py-2 pl-3 pr-4 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-purple-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700">Holidays</a>
                                </li>
                                <li>
                                    <a href="#blog" className="block py-2 pl-3 pr-4 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-purple-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700">Blog</a>
                                </li>
                                <li>
                                    <a href="#" className="block py-2 pl-3 pr-4 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-purple-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700">Contact</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </header>

            <section className="bg-gray-50 dark:bg-gray-900 pt-20"> {/* Added pt-20 to push content below fixed header */}
                <div className="grid max-w-screen-xl px-4 pt-20 pb-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12 lg:pt-20"> {/* Adjusted pt- to align with header */}
                    <div className="mr-auto place-self-center lg:col-span-7">
                        <h1 className="max-w-2xl mb-4 text-4xl font-extrabold leading-none tracking-tight md:text-5xl xl:text-6xl dark:text-white">Malaysia Public & School Holidays 🇲🇾</h1>
                        <p className="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">Your ultimate guide to all public and school holidays in Malaysia for 2025 and 2026. Plan your getaways, set reminders, and explore amazing local travel destinations!</p>
                        <a href="#holidays" className="inline-flex items-center justify-center px-5 py-3 mr-3 text-base font-medium text-center text-white rounded-lg bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 dark:focus:ring-purple-900">
                            View Holidays
                            <svg className="w-5 h-5 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                        </a>
                        <a href="#blog" className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800">
                            Explore Travel Ideas
                        </a>
                    </div>
                    <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
                        {/* Hero Banner Image */}
                        <img src="/images/hero.png" className="w-auto h-auto max-w-full" alt="Malaysia Travel Illustration" />
                    </div>
                </div>
            </section>

            <main className="container mx-auto p-4 py-8">
                <section id="holidays" className="mb-12 pt-16"> {/* Added pt-16 for spacing below hero */}
                    <h2 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">Malaysia Holiday Calendar 🗓️</h2>
                    <HolidayCalendar />
                </section>

                <hr className="border-gray-300 dark:border-gray-700 my-12" />

                <section id="blog" className="pt-16"> {/* Added pt-16 for spacing */}
                    <h2 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">Malaysia Travel Ideas & Blog 📝</h2>
                    <BlogSection />
                </section>
            </main>

            <footer className="bg-gray-50 dark:bg-gray-800">
                <div className="max-w-screen-xl p-4 py-8 mx-auto lg:py-16 md:p-8 lg:p-10">
                    <div className="mx-auto max-w-screen-sm text-center">
                        <a href="#" className="flex items-center justify-center mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
                            {/* Replaced Flowbite logo with cuti_cuti_logo.png and removed text */}
                            <img src="/images/cuti_cuti_logo.png" className="h-6 mr-3 sm:h-9" alt="cuti-cuti.my Logo" />
                        </a>
                        <p className="font-light text-gray-500 dark:text-gray-400">Plan your perfect Malaysian getaway with ease. View official holidays, set reminders, and get inspired by our travel guides.</p>
                    </div>
                    <div className="flex justify-center items-center mt-6">
                        {/* Dark/Light Mode Toggle Switch (duplicated in footer for consistency if needed, otherwise remove) */}
                        <label className="inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                value=""
                                className="sr-only peer"
                                checked={theme === 'dark'}
                                onChange={toggleTheme}
                                aria-label={`Switch to ${theme === 'light' ? 'Dark Mode' : 'Light Mode'}`}
                            />
                            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                            <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                                {theme === 'light' ? 'Light Mode ☀️' : 'Dark Mode 🌙'}
                            </span>
                        </label>
                    </div>
                    <div className="flex justify-center items-center mt-6">
                        <a href="https://twitter.com" className="text-gray-500 hover:text-gray-900 dark:hover:text-white mx-3">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c-1.42 0-2.73-.41-3.86-1.12.09.01.19.01.28.01 1.62 0 3.12-.55 4.33-1.48-1.5-.03-2.76-.99-3.19-2.31.21.04.42.06.64.06.31 0 .61-.04.89-.12-1.57-.32-2.76-1.7-2.76-3.32v-.04c.48.27 1.04.44 1.65.46-1.02-.68-1.69-1.85-1.69-3.17 0-.7.19-1.35.5-1.92 1.71 2.1 4.28 3.5 7.15 3.65-.05-.27-.08-.55-.08-.83 0-2.01 1.63-3.64 3.64-3.64 1.05 0 2.01.44 2.68 1.16.83-.16 1.62-.47 2.33-.89-.27.85-.85 1.57-1.62 2.02.74-.08 1.45-.28 2.1-.58-.5 1.25-1.2 2.35-2.22 3.22C19.95 18.281 18.42 19.451 16.7 19.861c-.55.13-1.12.19-1.7.19-1.25 0-2.45-.26-3.55-.74Z" clipRule="evenodd"></path></svg>
                        </a>
                        {/* Add more social icons as needed */}
                    </div>
                    <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8">
                        © {new Date().getFullYear()} <a href="#" className="hover:underline">cuti-cuti.my</a>. All Rights Reserved.
                    </div>
                </div>
            </footer>
        </>
    );
}

export default App;