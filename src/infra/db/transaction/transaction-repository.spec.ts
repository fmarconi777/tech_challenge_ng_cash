import { RecordData, RecordTransactionORM } from '../../protocols/transaction/record-transaction-orm'
import { TransactionRepository } from './transaction-repository'

const recordData = {
  debitedAccountId: 1,
  debitedBalance: 0.00,
  creditedAccountId: 2,
  creditedBalance: 200.00,
  value: 100.00
}

const makeRecordTransactionORMStub = (): RecordTransactionORM => {
  class RecordTransactionORMStub implements RecordTransactionORM {
    async record (recordData: RecordData): Promise<string> {
      return await Promise.resolve('Transaction succesfully recorded')
    }
  }
  return new RecordTransactionORMStub()
}

type SubTypes = {
  sut: TransactionRepository
  recordTransactionORMStub: RecordTransactionORM
}

const makeSut = (): SubTypes => {
  const recordTransactionORMStub = makeRecordTransactionORMStub()
  const sut = new TransactionRepository(recordTransactionORMStub)
  return {
    sut,
    recordTransactionORMStub
  }
}

describe('Transaction Repository', () => {
  test('Should call recordTransactionORMStub with correct values', async () => {
    const { sut, recordTransactionORMStub } = makeSut()
    const recordSpy = jest.spyOn(recordTransactionORMStub, 'record')
    await sut.record(recordData)
    expect(recordSpy).toHaveBeenCalledWith(recordData)
  })

  test('Should throw if recordTransactionORMStub throws', async () => {
    const { sut, recordTransactionORMStub } = makeSut()
    jest.spyOn(recordTransactionORMStub, 'record').mockReturnValueOnce(Promise.reject(new Error()))
    const record = sut.record(recordData)
    await expect(record).rejects.toThrow()
  })

  test('Should return a message on success', async () => {
    const { sut } = makeSut()
    const userAccount = await sut.record(recordData)
    expect(userAccount).toEqual('Transaction succesfully recorded')
  })
})
