import { FakeUploader } from './fake-uploader'

describe('Uploader', () => {
  it('should be able to upload a fake file', async () => {
    const uploader = new FakeUploader()
    const { key } = await uploader.upload({
      body: Buffer.from(''),
      filename: 'test.png',
      mimeType: 'image/png',
    })

    expect(key).toEqual(expect.any(String))
  })
})
