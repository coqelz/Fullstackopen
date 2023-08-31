import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {

  const blogUser = {
    username: 'root',
    name: 'root',
  }
  const blog = {
    title: 'test',
    author: 'tester',
    url: 'https://testing.com',
    user: blogUser,
    likes: 0
  }
  let container
  const mockLikeHandler = jest.fn()
  const mockRemoveHandler = jest.fn()
  beforeEach(() => {
    container = render(<Blog blog={blog} handleLike={mockLikeHandler} handleRemove={mockRemoveHandler} />).container
  })
  test('renders content', () => {
    const title = screen.getByText('test tester')
    const div = container.querySelector('.infoContent')
    expect(title).toBeDefined()
    expect(div).toHaveStyle('display: none')
  })
  test('after clicking the view button, url, likes and user are displayed', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const div = container.querySelector('.infoContent')
    expect(div).not.toHaveStyle('display: none')
    const url = screen.getByText('https://testing.com')
    const likes = screen.getByText('0')
    const username = screen.getByText('root')
    expect(url).toBeDefined()
    expect(likes).toBeDefined()
    expect(username).toBeDefined()
  })
  test('after clicking the like button twice, likes is called twice are displayed', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('like')
    await user.click(button)
    await user.click(button)
    expect(mockLikeHandler.mock.calls).toHaveLength(2)
  })

})