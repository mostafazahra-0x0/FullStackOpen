const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('dummy', () => {
  test('returns one', () => {
    assert.strictEqual(listHelper.dummy([]), 1)
  })
})
describe('total likes', () => {
    test('total likes', () => {
      const result = listHelper.totalLikes([
        { likes: 5 },
        { likes: 3 },
        { likes: 2 },
      ])
      assert.strictEqual(result, 10)
    })
    test('of empty list is zero', () => {
      const result = listHelper.totalLikes([])
      assert.strictEqual(result, 0)
    })
    test('when list has only one blog, equals the likes of that', () => {
      const result = listHelper.totalLikes([{ likes: 5 }])
      assert.strictEqual(result, 5)
    })    
})