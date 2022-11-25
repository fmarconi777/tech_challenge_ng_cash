import { LoadTransactionsByIdORM, RecordsData } from '../../protocols/transaction/load-transactions-orm'
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

const makeLoadTransactionsByIdORMStub = (): LoadTransactionsByIdORM => {
  class LoadTransactionsByIdORMStub implements LoadTransactionsByIdORM {
    async loadById (id: number): Promise<RecordsData[]> {
      return await Promise.resolve([{
        id: 'any_id',
        debitedUsername: 'any_debitedUsername',
        creditedUsername: 'any_creditedUsername',
        value: 'any_value',
        createdAt: 'any_createdAt'
      }])
    }
  }
  return new LoadTransactionsByIdORMStub()
}

type SubTypes = {
  sut: TransactionRepository
  recordTransactionORMStub: RecordTransactionORM
  loadTransactionsByIdORMStub: LoadTransactionsByIdORM
}

const makeSut = (): SubTypes => {
  const loadTransactionsByIdORMStub = makeLoadTransactionsByIdORMStub()
  const recordTransactionORMStub = makeRecordTransactionORMStub()
  const sut = new TransactionRepository(recordTransactionORMStub, loadTransactionsByIdORMStub)
  return {
    sut,
    recordTransactionORMStub,
    loadTransactionsByIdORMStub
  }
}

describe('Transaction Repository', () => {
  describe('Record method', () => {
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

  describe('LoadById method', () => {
    test('Should call LoadTransactionsByIdORM with correct values', async () => {
      const { sut, loadTransactionsByIdORMStub } = makeSut()
      const loadByIdSpy = jest.spyOn(loadTransactionsByIdORMStub, 'loadById')
      await sut.loadById(1)
      expect(loadByIdSpy).toHaveBeenCalledWith(1)
    })

    test('Should throw if LoadTransactionsByIdORM throws', async () => {
      const { sut, loadTransactionsByIdORMStub } = makeSut()
      jest.spyOn(loadTransactionsByIdORMStub, 'loadById').mockReturnValueOnce(Promise.reject(new Error()))
      const record = sut.loadById(1)
      await expect(record).rejects.toThrow()
    })

    test('Should return an array of records on success', async () => {
      const { sut } = makeSut()
      const userAccount = await sut.loadById(1)
      expect(userAccount).toEqual([{
        id: 'any_id',
        debitedUsername: 'any_debitedUsername',
        creditedUsername: 'any_creditedUsername',
        value: 'any_value',
        createdAt: 'any_createdAt'
      }])
    })
  })
})
