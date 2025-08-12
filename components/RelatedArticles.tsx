import Link from 'next/link';

interface RelatedArticle {
    id: string;
    title: string;
}

const RelatedArticles = ({ articles }: { articles: RelatedArticle[] }) => {
    if (!articles || articles.length === 0) {
        return null;
    }

    return (
        <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Related Articles</h2>
            <ul className="space-y-2">
                {articles.map((article) => (
                    <li key={article.id}>
                        <Link href={`/blog/${article.id}`} className="text-blue-500 hover:underline">
                            {article.title}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RelatedArticles;
