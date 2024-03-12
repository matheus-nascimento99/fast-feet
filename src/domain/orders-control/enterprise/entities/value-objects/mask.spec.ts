import { Mask } from './mask'

describe('Take off mask test', () => {
  it('should be able to take off mask and spaces from string', () => {
    const text = ' +551195119-5312&&%./'
    const unmaskedText = Mask.takeOffFromText(text)

    expect(unmaskedText.value).toEqual('5511951195312')
  })
})
