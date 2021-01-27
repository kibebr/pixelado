import Sketch from '../../../lib/domain/roots/Sketch.js'
import SketchComment from '../../../lib/domain/entities/SketchComment.js'
import SketchVote from '../../../lib/domain/entities/SketchVote.js'
import { createValidSketch } from './fixtures/createValidSketch.js'

describe('Sketch Entity', () => {
  describe('Validation', () => {
    describe('Title', () => {
      it('should throw InvalidParamError("title") if title is not alphanumeric', () => {
        expect.assertions(2)

        const sketch = createValidSketch({ title: '###' })

        try {
          Sketch.validate(sketch)
        } catch (err) {
          expect(err.name).toBe('InvalidParamError')
          expect(err.param).toBe('title')
        }
      })

      it('should accept titles with space', () => {
        const sketch = createValidSketch({ title: 'a title with spaces' })

        const result = Sketch.validate(sketch)

        expect(result).toBe(undefined)
      })

      it('should return undefined if valid', () => {
        const sketch = createValidSketch()

        const result = Sketch.validate(sketch)

        expect(result).toBe(undefined)
      })
    })

    describe('Size', () => {
      it('should throw InvalidParamError if size(height) is less than minimum size', () => {
        expect.assertions(2)

        const sketch = createValidSketch({ size: { w: Sketch.MAX_SIZE, h: Sketch.MIN_SIZE - 1 } })

        try {
          Sketch.validate(sketch)
        } catch (err) {
          expect(err.name).toBe('InvalidParamError')
          expect(err.param).toBe('size')
        }
      })
      it('should throw InvalidParamError if size(width) is less than minimum size', () => {
        expect.assertions(2)

        const sketch = createValidSketch({ size: { w: Sketch.MIN_SIZE - 1, h: Sketch.MIN_SIZE } })

        try {
          Sketch.validate(sketch)
        } catch (err) {
          expect(err.name).toBe('InvalidParamError')
          expect(err.param).toBe('size')
        }
      })
      it('should throw InvalidParamError if size(width) exceeds the limit', () => {
        expect.assertions(2)

        const sketch = createValidSketch({ size: { w: Sketch.MAX_SIZE + 1, h: Sketch.MIN_SIZE } })

        try {
          Sketch.validate(sketch)
        } catch (err) {
          expect(err.name).toBe('InvalidParamError')
          expect(err.param).toBe('size')
        }
      })

      it('should throw InvalidParamError if size(height) exceeds the limit', () => {
        expect.assertions(2)

        const sketch = createValidSketch({ size: { w: Sketch.MIN_SIZE, h: Sketch.MAX_SIZE + 1 } })

        try {
          Sketch.validate(sketch)
        } catch (err) {
          expect(err.name).toBe('InvalidParamError')
          expect(err.param).toBe('size')
        }
      })

      it('should return undefined if valid', () => {
        const sketch = createValidSketch()

        const result = Sketch.validate(sketch)

        expect(result).toBe(undefined)
      })
    })
  })

  describe('Adding a comment', () => {
    it('should add a comment if comment is valid', () => {
      const comment = new SketchComment('kibe', 'a valid comment =)')
      const sut = createValidSketch()

      sut.addComment(comment)

      expect(sut.comments).toContain(comment)
    })

    it('should throw InvalidParamError("repetition") if a comment with same author and content already exists', () => {
      expect.assertions(2)

      const commentX = new SketchComment('kibe', 'a comment')
      const commentY = new SketchComment('kibe', 'a comment')
      const sut = createValidSketch()
      sut.comments.push(commentX)

      try {
        sut.addComment(commentY)
      } catch (err) {
        expect(err.name).toBe('InvalidParamError')
        expect(err.param).toBe('repetition')
      }
    })
  })

  describe('Casting votes', () => {
    it('creates a new key for a new type of vote', () => {
      const vote = new SketchVote({
        author: 'kibe',
        type: 'claps',
        count: 1
      })
      const sketch = createValidSketch()

      sketch.addVote(vote)

      expect(sketch.votes.claps).toBeDefined()
    })

    it('stores the rest of SketchVotes` properties (author and count)', () => {
      const vote = new SketchVote({
        author: 'kibe',
        type: 'claps',
        count: 1
      })
      const sketch = createValidSketch()

      sketch.addVote(vote)

      expect(sketch.votes.claps[0]).toStrictEqual({
        author: vote.author,
        count: vote.count
      })
    })

    it('does not replace an already created key when adding new votes with the same key', () => {
      const sketch = createValidSketch()
      sketch.votes.awesomes = [{
        author: 'kibe',
        count: 3
      }]

      sketch.addVote(new SketchVote({
        author: 'john',
        type: 'awesomes',
        count: 5
      }))

      expect(sketch.votes.awesomes).toStrictEqual([{
        author: 'kibe',
        count: 3
      }, {
        author: 'john',
        count: 5
      }
      ])
    })

    it('only adds the counts when a new vote with an existing author & type is inserted', () => {
      const sketch = createValidSketch()
      const threeWows = new SketchVote({
        author: 'kibezinho',
        type: 'wows',
        count: 3
      })
      const twoMoreWows = new SketchVote({
        author: 'kibezinho',
        type: 'wows',
        count: 2
      })

      sketch.addVote(threeWows)
      sketch.addVote(twoMoreWows)

      expect(sketch.votes.wows.length).toBe(1)
      expect(sketch.votes.wows[0].count).toBe(5)
    })

    it('adds a separate vote into the array when a new vote is of different authors but same type', () => {
      const sketch = createValidSketch()
      const kibesClap = new SketchVote({
        author: 'kibe',
        type: 'claps',
        count: 1
      })
      const robertosClaps = new SketchVote({
        author: 'roberto',
        type: 'claps',
        count: 5
      })

      sketch.addVote(kibesClap)
      sketch.addVote(robertosClaps)

      expect(sketch.votes.claps.length).toBe(2)
      expect(sketch.votes.claps).toContainEqual({
        author: kibesClap.author,
        count: kibesClap.count
      })
      expect(sketch.votes.claps).toContainEqual({
        author: robertosClaps.author,
        count: robertosClaps.count
      })
    })

    it('throws error when a vote is given more than the limit (10 times)', () => {
      expect.assertions(2)
      const sketch = createValidSketch()

      try {
        for (let i = 0, limit = 10; i <= limit; ++i) {
          sketch.addVote(new SketchVote({
            author: 'kibe',
            type: 'claps',
            count: 1
          }))
        }
      } catch (err) {
        expect(err.name).toBe('ActionOverperformedError')
        expect(err.verb).toBe('voted')
      }
    })
  })

  describe('Utils', () => {
    describe('getAllVotes', () => {
      it('gets all votes from a sketch', () => {
        const sut = createValidSketch({
          votes: {
            claps: [{ count: 10 }, { count: 20 }],
            hearts: [{ count: 30 }]
          }
        })

        const votes = Sketch.getAllVotes(sut)

        expect(votes).toBe(60)
      })
    })
  })
})

// TODO: maybe use value objects or separate validations into functions for more test isolation
