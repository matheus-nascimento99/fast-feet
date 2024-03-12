import { makeOrder } from 'test/factories/make-order'
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-order'
import { FakeUploader } from 'test/storage/uploader/fake-uploader'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { InvalidAttachmentSize } from './errors/invalid-attachment-size'
import { InvalidAttachmentType } from './errors/invalid-attachment-type'
import { SaveOrderAttachmentUseCase } from './save-order-attachment'

let inMemoryOrdersRepository: InMemoryOrdersRepository
let fakeUploader: FakeUploader
let sut: SaveOrderAttachmentUseCase

describe('Save order attachment use case', () => {
  beforeEach(() => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository()
    fakeUploader = new FakeUploader()
    sut = new SaveOrderAttachmentUseCase(inMemoryOrdersRepository, fakeUploader)
  })

  it('should be able to save an order attachment', async () => {
    const order = makeOrder()
    await inMemoryOrdersRepository.create(order)

    const result = await sut.execute({
      orderId: order.id.toString(),
      filename: 'example-filename.jpg',
      mimeType: 'image/jpg',
      size: 400,
      body: Buffer.from(''),
    })

    expect(result.isRight()).toEqual(true)
    expect(result.value).toHaveProperty(
      'item',
      expect.objectContaining({ id: order.id }),
    )
  })

  it('should not be able to save an order attachment with an inexistent order', async () => {
    const inexistentOrderId = 'example-inexistent-order-id'

    const result = await sut.execute({
      orderId: inexistentOrderId,
      filename: 'example-filename.jpg',
      mimeType: 'image/jpg',
      size: 400,
      body: Buffer.from(''),
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to save an order attachment with an invalid mimetype', async () => {
    const order = makeOrder()
    await inMemoryOrdersRepository.create(order)

    const result = await sut.execute({
      orderId: order.id.toString(),
      filename: 'example-filename.gif',
      mimeType: 'image/gif',
      size: 400,
      body: Buffer.from(''),
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(InvalidAttachmentType)
  })

  it('should not be able to save an order attachment with an invalid size', async () => {
    const order = makeOrder()
    await inMemoryOrdersRepository.create(order)

    const result = await sut.execute({
      orderId: order.id.toString(),
      filename: 'example-filename.jpg',
      mimeType: 'image/jpg',
      size: 5242881,
      body: Buffer.from(''),
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(InvalidAttachmentSize)
  })
})
