"use client";

import { useEffect, useState } from 'react';

interface Heading {
    id: string;
    text: string;
    level: number;
}

const TableOfContents = ({ content }: { content: string }) => {
    const [headings, setHeadings] = useState<Heading[]>([]);

    useEffect(() => {
        const headingElements = Array.from(
            document.querySelectorAll('h1, h2, h3, h4, h5, h6')
        );
        const newHeadings = headingElements.map((heading) => {
            const id = heading.id || heading.textContent?.toLowerCase().replace(/\s+/g, '-') || '';
            heading.id = id;
            return {
                id,
                text: heading.textContent || '',
                level: Number(heading.tagName.substring(1)),
            };
        });
        setHeadings(newHeadings);
    }, [content]);

    return (
        <div className="p-4 bg-gray-100 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Table of Contents</h2>
            <ul>
                {headings.map((heading) => (
                    <li key={heading.id} style={{ marginLeft: `${(heading.level - 1) * 1.5}rem` }}>
                        <a href={`#${heading.id}`} className="hover:underline">
                            {heading.text}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TableOfContents;
