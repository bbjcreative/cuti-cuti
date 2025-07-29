// BlogSection.js
import React, { useState, useEffect } from 'react';

function BlogSection() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBlogPosts = async () => {
            try {
                const response = await fetch('https://zwilf14auh.execute-api.ap-southeast-5.amazonaws.com/Prod/releases');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();

                const formattedPosts = data.releases.map(item => {
                    const slug = item.title.toLowerCase()
                                        .replace(/[^a-z0-9\s-]/g, '')
                                        .replace(/\s+/g, '-')
                                        .replace(/-+/g, '-');

                    const excerpt = item.content.length > 150
                        ? item.content.substring(0, 150) + '...'
                        : item.content;

                    // --- NEW & IMPROVED FIX FOR "DDth of Mon YYYY" DATE FORMAT ---
                    let formattedDate = 'Date Unavailable'; // Default value
                    try {
                        // Regex to extract day, month, and year
                        const dateMatch = item.date.trim().match(/^(\d{1,2})(?:st|nd|rd|th)? of (\w+) (\d{4})$/i);

                        if (dateMatch && dateMatch.length === 4) {
                            const day = parseInt(dateMatch[1], 10);
                            const monthName = dateMatch[2];
                            const year = parseInt(dateMatch[3], 10);

                            // Month mapping (case-insensitive)
                            const monthMap = {
                                'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3,
                                'may': 4, 'jun': 5, 'jul': 6, 'aug': 7,
                                'sep': 8, 'oct': 9, 'nov': 10, 'dec': 11,
                                // Also include full month names just in case
                                'january': 0, 'february': 1, 'march': 2, 'april': 3,
                                'june': 5, 'july': 6, 'august': 7,
                                'september': 8, 'october': 9, 'november': 10, 'december': 11
                            };
                            const month = monthMap[monthName.toLowerCase()];

                            if (month !== undefined && !isNaN(day) && !isNaN(year)) {
                                const dateObj = new Date(year, month, day);
                                // Validate if the constructed date matches the input (e.g., prevent Feb 30th)
                                if (dateObj.getFullYear() === year && dateObj.getMonth() === month && dateObj.getDate() === day) {
                                     formattedDate = dateObj.toLocaleDateString('en-MY', { year: 'numeric', month: 'long', day: 'numeric' });
                                } else {
                                    console.warn("Constructed date mismatch for:", item.date);
                                }
                            } else {
                                console.warn("Invalid date parts after regex match for:", item.date);
                            }
                        } else {
                            console.warn("Date string did not match expected 'DDth of Mon YYYY' format:", item.date);
                        }
                    } catch (e) {
                        console.error("Error processing date:", item.date, e);
                    }
                    // --- END NEW FIX ---

                    const placeholderImages = [
                        '/images/blog-placeholder-1.jpg',
                        '/images/blog-placeholder-2.jpg',
                        '/images/blog-placeholder-3.jpg'
                    ];
                    const randomImage = placeholderImages[Math.floor(Math.random() * placeholderImages.length)];

                    return {
                        id: slug,
                        title: item.title,
                        slug: slug,
                        date: formattedDate,
                        content: item.content,
                        excerpt: excerpt,
                        featuredImage: randomImage,
                        originalLink: item.link
                    };
                });
                setPosts(formattedPosts);
            } catch (err) {
                setError("Failed to fetch travel ideas: " + err.message);
                console.error("API Fetch Error for blog posts:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogPosts();
    }, []);

    if (loading) return <p className="text-center dark:text-gray-400">Loading exciting travel ideas from Malaysia...</p>;
    if (error) return <p className="text-center text-red-500">Error: {error}</p>;

    if (posts.length === 0) return <p className="text-center dark:text-gray-400">No new travel ideas available at the moment. Check back soon!</p>;

    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map(post => (
                <article key={post.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                    <img src={post.featuredImage} alt={post.title} className="w-full h-48 object-cover"/>
                    <div className="p-5">
                        <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{post.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">{post.excerpt}</p>
                        <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mb-3">
                            <span>Published on: {post.date}</span>
                        </div>
                        <a href={`/blog/${post.slug}`} className="text-purple-700 hover:underline dark:text-purple-400">Read More &rarr;</a>
                    </div>
                </article>
            ))}
        </div>
    );
}

export default BlogSection;