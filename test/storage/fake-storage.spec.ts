import { FakeStorage } from './fake-storage'

describe('Storage', () => {
  it('should be able to upload a fake file', async () => {
    const storage = new FakeStorage()
    const { key } = await storage.upload({
      body: Buffer.from(''),
      filename: 'test.png',
      fileType: 'image/png',
    })

    expect(key).toEqual(expect.any(String))
  })
})
