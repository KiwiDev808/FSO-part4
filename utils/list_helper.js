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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
}
