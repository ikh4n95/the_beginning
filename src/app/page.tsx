import { prisma } from '@/lib/prisma';

export default async function Home() {
  // Fetch all posts from the database
  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  const postCount = posts.length;
  const publishedCount = posts.filter((p: { published: boolean }) => p.published).length;

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center space-y-6 mb-12">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
              Hello, World!
            </h1>
            <div className="w-24 h-1 bg-indigo-600 dark:bg-indigo-400 mx-auto rounded-full"></div>
          </div>
          
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Welcome to your Next.js application with TypeScript & Prisma
          </p>
          
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-lg">
              <span className="text-lg">✨</span>
              <span className="font-semibold">Next.js 14</span>
            </div>
            
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg shadow-lg">
              <span className="text-lg">🗄️</span>
              <span className="font-semibold">SQLite + Prisma</span>
            </div>
          </div>
          
          {/* Database Stats */}
          <div className="mt-8 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md inline-block">
            <div className="flex gap-6 text-sm">
              <div>
                <p className="text-gray-600 dark:text-gray-400 mb-1">Total Posts</p>
                <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{postCount}</p>
              </div>
              <div className="w-px bg-gray-300 dark:bg-gray-600"></div>
              <div>
                <p className="text-gray-600 dark:text-gray-400 mb-1">Published</p>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{publishedCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Posts Showcase
          </h2>
          
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                No posts yet. Run <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">npm run db:seed</code> to create sample posts.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post: { id: number; title: string; content: string | null; published: boolean; createdAt: Date; updatedAt: Date }) => (
                <div
                  key={post.id}
                  className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow border-l-4 ${
                    post.published
                      ? 'border-emerald-500'
                      : 'border-gray-400'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white pr-2">
                      {post.title}
                    </h3>
                    {post.published ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                        Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                        Draft
                      </span>
                    )}
                  </div>
                  
                  {post.content && (
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                      {post.content}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <span>ID: {post.id}</span>
                    <span>
                      {new Date(post.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
