import { Either, left, right } from './either'

const doSomething = (shouldSomething: boolean): Either<string, string> => {
  if (shouldSomething) {
    return right('success')
  } else {
    return left('error')
  }
}

it('should be able to return a success response', () => {
  const response = doSomething(true)

  expect(response.isLeft()).toEqual(false)
  expect(response.isRight()).toEqual(true)
})

it('should be able to return a error response', () => {
  const response = doSomething(false)

  expect(response.isLeft()).toEqual(true)
  expect(response.isRight()).toEqual(false)
})
