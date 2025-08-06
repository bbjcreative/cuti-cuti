import React, { useState, useEffect } from 'react';

// Basic Modal Component (can be in a separate file, e.g., components/BlogModal.js)
const BlogModal = ({ post, onClose }) => {
    if (!post) return null;

    // Function to format plain text content into paragraphs
    const formatContent = (text) => {
        if (!text) return null;
        // Split the text by newline characters to get individual lines.
        // Filter out any lines that are just whitespace (e.g., from consecutive newlines)
        const paragraphs = text.split('\n').filter(line => line.trim() !== '');
        
        return (
            <>
                {paragraphs.map((paragraph, index) => (
                    // Wrap each valid line in a paragraph tag for proper formatting.
                    // 'mb-4' adds margin-bottom for spacing between paragraphs.
                    // 'last:mb-0' ensures the last paragraph doesn't have extra bottom margin.
                    <p key={index} className="mb-4 last:mb-0">
                        {paragraph}
                    </p>
                ))}
            </>
        );
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative p-6">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-2xl font-bold"
                    aria-label="Close modal"
                >
                    &times;
                </button>
                {post.featuredImage && (
                    <img src={post.featuredImage} alt={post.title} className="w-full h-64 object-cover rounded-md mb-6" />
                )}
                <h2 className="text-3xl font-bold mb-3 text-gray-900 dark:text-white">{post.title}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Published on: {post.date}</p>
                <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
                    {formatContent(post.content)}
                </div>
                 {post.originalLink && (
                    <p className="mt-8 text-sm text-gray-600 dark:text-gray-400">
                        Source: <a href={post.originalLink} target="_blank" rel="noopener noreferrer" className="text-purple-700 hover:underline dark:text-purple-400">Read original article</a>
                    </p>
                )}
            </div>
        </div>
    );
};


function BlogSection() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- State for Modal ---
    const [selectedPost, setSelectedPost] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // --- State for Pagination ---
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 6; // 2 rows * 3 columns

    useEffect(() => {
        const fetchBlogPosts = async () => {
            try {
                // *** UPDATED API ENDPOINT HERE ***
                const response = await fetch('https://81zon8jxx5.execute-api.ap-southeast-5.amazonaws.com/Prod/releases');
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

                    let formattedDate = 'Date Unavailable';
                    try {
                        // Corrected regex to match "31st of Aug" format and append the current year
                        const dateMatch = item.date.trim().match(/^(\d{1,2})(?:st|nd|rd|th)? of (\w+)/i);

                        if (dateMatch && dateMatch.length >= 3) {
                            const day = parseInt(dateMatch[1], 10);
                            const monthName = dateMatch[2];
                            const currentYear = new Date().getFullYear();

                            const monthMap = {
                                'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3,
                                'may': 4, 'jun': 5, 'jul': 6, 'aug': 7,
                                'sep': 8, 'oct': 9, 'nov': 10, 'dec': 11,
                                'january': 0, 'february': 1, 'march': 2, 'april': 3,
                                'june': 5, 'july': 6, 'august': 7,
                                'september': 8, 'october': 9, 'november': 10, 'december': 11
                            };
                            const month = monthMap[monthName.toLowerCase()];

                            if (month !== undefined && !isNaN(day)) {
                                const dateObj = new Date(currentYear, month, day);
                                if (dateObj.getFullYear() === currentYear && dateObj.getMonth() === month && dateObj.getDate() === day) {
                                    formattedDate = dateObj.toLocaleDateString('en-MY', { year: 'numeric', month: 'long', day: 'numeric' });
                                }
                            }
                        }
                    } catch (e) {
                        console.error("Error processing date:", item.date, e);
                    }

                    const placeholderImage = `https://picsum.photos/seed/${slug}/600/400`;
                    
                    return {
                        id: slug,
                        title: item.title,
                        slug: slug,
                        date: formattedDate,
                        content: item.content,
                        featuredImage: item.image_url || placeholderImage,
                        excerpt: excerpt,
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

    // --- Modal Handlers ---
    const openModal = (post) => {
        setSelectedPost(post);
        setIsModalOpen(true);
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedPost(null);
        document.body.style.overflow = 'unset'; // Re-enable background scrolling
    };

    // --- Pagination Logic ---
    const totalPages = Math.ceil(posts.length / postsPerPage);
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

    const Pagination = () => {
        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(i);
        }

        return (
            <nav className="mt-8 flex justify-center">
                <ul className="inline-flex -space-x-px text-base h-10">
                    <li>
                        <button
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="flex items-center justify-center px-4 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                    </li>
                    {pageNumbers.map(number => (
                        <li key={number}>
                            <button
                                onClick={() => paginate(number)}
                                className={`flex items-center justify-center px-4 h-10 leading-tight border border-gray-300 dark:border-gray-700 ${
                                    currentPage === number
                                        ? 'text-purple-600 bg-purple-50 hover:bg-purple-100 hover:text-purple-700 dark:bg-gray-700 dark:text-white'
                                        : 'text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                                }`}
                            >
                                {number}
                            </button>
                        </li>
                    ))}
                     <li>
                        <button
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </li>
                </ul>
            </nav>
        );
    };


    if (loading) return <p className="text-center dark:text-gray-400">Loading exciting travel ideas from Malaysia...</p>;
    if (error) return <p className="text-center text-red-500">Error: {error}</p>;

    if (posts.length === 0) return <p className="text-center dark:text-gray-400">No new travel ideas available at the moment. Check back soon!</p>;

    return (
        <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentPosts.map(post => (
                    <article key={post.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                        <img src={post.featuredImage} alt={post.title} className="w-full h-48 object-cover"/>
                        <div className="p-5">
                            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{post.title}</h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">{post.excerpt}</p>
                            <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mb-3">
                                <span>Published on: {post.date}</span>
                            </div>
                            <button
                                onClick={() => openModal(post)}
                                className="text-purple-700 hover:underline dark:text-purple-400 cursor-pointer"
                            >
                                Read More &rarr;
                            </button>
                        </div>
                    </article>
                ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && <Pagination />}


            {/* Blog Modal */}
            {isModalOpen && <BlogModal post={selectedPost} onClose={closeModal} />}
        </>
    );
}

export default BlogSection;