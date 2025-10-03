const { test, describe } = require('node:test')
const assert = require('node:assert')
const favoriteGrabacion = require('../utils/list_helper').favoriteGrabacion

describe('favorite grabacion', () => {
  const grabacion = [
    {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12
    }
  ]
  const grabaciones = [
    {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12
    },
    {
      title: 'Type wars',
      author: 'Robert C. Martin',
      likes: 10
    },
    {
      title: 'React vs Vue',
      author: 'Linus Torvalds',
      likes: 15
    }
  ]
  test('of empty list is null', () => {
    assert.deepStrictEqual(favoriteGrabacion([]), null)
  })

  test('when list has only one grabacion', () => {
    assert.deepStrictEqual(favoriteGrabacion(grabacion), grabacion[0])
  })

  test('of a bigger list is grabacion with most likes', () => {
    assert.deepStrictEqual(favoriteGrabacion(grabaciones), grabaciones[2])
  })
})