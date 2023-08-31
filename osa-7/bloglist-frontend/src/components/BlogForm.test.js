import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const user = userEvent.setup()
  const mockCreateHandler = jest.fn()

  render(<BlogForm createBlog={mockCreateHandler} />)

  const titleInput = screen.getByPlaceholderText('write blog title here')
  const authorInput = screen.getByPlaceholderText('write blog author here')
  const urlInput = screen.getByPlaceholderText('write blog url here')
  const createButton = screen.getByText('create')

  await user.type(titleInput, 'how to test a form')
  await user.type(authorInput, 'tester')
  await user.type(urlInput, '.com')
  await user.click(createButton)

  expect(mockCreateHandler.mock.calls).toHaveLength(1)
  expect(mockCreateHandler.mock.calls[0][0].title).toBe('how to test a form')
  expect(mockCreateHandler.mock.calls[0][0].author).toBe('tester')
  expect(mockCreateHandler.mock.calls[0][0].url).toBe('.com')
})