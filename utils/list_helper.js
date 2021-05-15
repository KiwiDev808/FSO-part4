const dummy = (blogs) => {
  if (Array.isArray(blogs)) {
    return 1
  }
  return 0
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }

  return blogs.length === 0 ? 0 : blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const reducer = (prev, current) => {
    return prev.likes > current.likes ? prev : current
  }

  return blogs.length === 0
    ? { message: 'the array is empty' }
    : blogs.reduce(reducer, blogs[0])
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return { message: 'the array is empty' }
  }

  const reducer = (acc, blog) => {
    const blogCount = (acc[blog.author]?.blogs || 0) + 1
    acc[blog.author] = {
      author: blog.author,
      blogs: blogCount,
    }
    return acc
  }

  const groupedAuthors = blogs.reduce(reducer, {})
  const mostBlogsAuthor = Object.values(groupedAuthors).reduce(
    (prev, current) => {
      return prev.blogs > current.blogs ? prev : current
    }
  )

  return mostBlogsAuthor
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
}
