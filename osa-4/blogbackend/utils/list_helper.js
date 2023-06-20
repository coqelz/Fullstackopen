const _ = require('lodash')


const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, item) => {return sum + item.likes}, 0)
}

const favoriteblog = (blogs) => {
  return blogs.length === 0
    ? {}
    : blogs.reduce((favorite, item) => {
      return favorite.likes >= item.likes
        ? { title: favorite.title, author: favorite.author, likes: favorite.likes }
        : { title: item.title, author: item.author, likes: item.likes }
    }, blogs[0])
}

const mostBlogs = (blogs) => {
  if(blogs.length === 0) return {}
  else{
    const arr = _.countBy(blogs, 'author')
    const author = Object.keys(arr).reduce((most, item) => {
      return arr[most] > arr[item]
        ? most
        : item
    })
    //return author
    return { author: author, blogs: arr[author] }
  }
}

const mostLikes = (blogs) => {
  if(blogs.length === 0) return {}
  else{
    const arr = _.groupBy(blogs, 'author')
    const author = Object.keys(arr).reduce((most, item) => {
      return totalLikes(arr[most]) > totalLikes(arr[item])
        ? most
        : item
    })
    //return author
    return { author: author, likes: totalLikes(arr[author]) }
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteblog,
  mostBlogs,
  mostLikes,
}