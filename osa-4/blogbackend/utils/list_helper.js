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
      if(favorite.likes >= item.likes) {
        return { title: favorite.title, author: favorite.author, likes: favorite.likes }
      } else {
        return { title: item.title, author: item.author, likes: item.likes }
      }
    }, blogs[0])
}

module.exports = {
  dummy,
  totalLikes,
  favoriteblog,
}

