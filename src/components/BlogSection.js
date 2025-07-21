import React from 'react';

function BlogSection() {
    // Placeholder for blog articles
    const blogPosts = [
        {
            id: 1,
            title: "Exploring Langkawi: An Island Paradise",
            excerpt: "Discover the stunning beaches, lush mangroves, and duty-free shopping of Langkawi.",
            // Example using Picsum Photos for a random image
            imageUrl: "https://picsum.photos/seed/langkawi/400/250",
            link: "#" // Placeholder link
        },
        {
            id: 2,
            title: "Kuala Lumpur City Guide: Beyond the Towers",
            excerpt: "A guide to experiencing the vibrant culture, delicious food, and hidden gems of KL.",
            // Example using a different Picsum Photos image
            imageUrl: "https://picsum.photos/seed/kualalumpur/400/250",
            link: "#" // Placeholder link
        },
        {
            id: 3,
            title: "Family Fun in Penang: Heritage and Food Adventures",
            excerpt: "From street art to hawker food, Penang offers endless entertainment for families.",
            // Example using another Picsum Photos image
            imageUrl: "https://picsum.photos/seed/penang/400/250",
            link: "#" // Placeholder link
        }
    ];

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl">
            <p className="text-gray-700 dark:text-gray-300 mb-6">
                Welcome to our blog, your go-to source for inspiring travel ideas and tips for exploring the wonders of Malaysia! Whether you're planning a **family trip**, a **solo adventure**, or looking for **local travel spots**, we've got you covered.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogPosts.map(post => (
                    <div key={post.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg shadow-md overflow-hidden">
                        <img src={post.imageUrl} alt={post.title} className="w-full h-48 object-cover" />
                        <div className="p-4">
                            <h3 className="text-xl font-semibold text-purple-600 dark:text-purple-400 mb-2">{post.title}</h3>
                            <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">{post.excerpt}</p>
                            <a href={post.link} className="inline-block bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-full transition duration-300">Read More</a>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 text-center">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Stay Updated! 📧</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">Subscribe to our newsletter for the latest travel guides and holiday updates.</p>
                <form className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
                    <input
                        type="email"
                        placeholder="Your email address"
                        className="p-3 border border-gray-300 dark:border-gray-600 rounded-md w-full sm:w-auto bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button
                        type="submit"
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-md transition duration-300 w-full sm:w-auto"
                    >
                        Subscribe
                    </button>
                </form>
            </div>
        </div>
    );
}

export default BlogSection;