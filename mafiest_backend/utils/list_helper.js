const _ = require('lodash')

const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}


const favoriteGrabacion = (grabaciones) => {
  if (grabaciones.length === 0) return null
  return grabaciones.reduce((prev, current) => (prev.likes > current.likes ? prev : current))
}


const mostGrabaciones = (grabaciones) => {
  if (grabaciones.length === 0) return null
  const authors = {}
  grabaciones.forEach(grabacion => {
    authors[grabacion.author] = (authors[grabacion.author] || 0) + 1
  })
  let max = 0
  let maxAuthor = null
  for (const author in authors) {
    if (authors[author] > max) {
      max = authors[author]
      maxAuthor = author
    }
  }
  return { author: maxAuthor, grabaciones: max }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null

  const grouped = _.groupBy(blogs, 'author')

  const mostLikedAuthor = _.maxBy(
    _.keys(grouped),
    author => _.sumBy(grouped[author], 'likes')
  )

  const totalLikes = _.sumBy(grouped[mostLikedAuthor], 'likes')

  return {
    author: mostLikedAuthor,
    likes: totalLikes
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteGrabacion,
  mostGrabaciones,
  mostLikes
}