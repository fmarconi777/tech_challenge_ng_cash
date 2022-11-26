import { LoadTransactionsByAccountIdORM, RecordsData, RecordData, RecordTransactionORM } from './transaction-repository-protocols'
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

const makeLoadTransactionsByAccountIdORMStub = (): LoadTransactionsByAccountIdORM => {
  class LoadTransactionsByAccountIdORMStub implements LoadTransactionsByAccountIdORM {
    async loadByAccountId (id: number): Promise<RecordsData[]> {
      return await Promise.resolve([{
        id: 'any_id',
        debitedUsername: 'any_debitedUsername',
        creditedUsername: 'any_creditedUsername',
        value: 'any_value',
        createdAt: 'any_createdAt'
      }])
    }
  }
  return new LoadTransactionsByAccountIdORMStub()
}

type SubTypes = {
  sut: TransactionRepository
  recordTransactionORMStub: RecordTransactionORM
  loadTransactionsByAccountIdORMStub: LoadTransactionsByAccountIdORM
}

const makeSut = (): SubTypes => {
  const loadTransactionsByAccountIdORMStub = makeLoadTransactionsByAccountIdORMStub()
  const recordTransactionORMStub = makeRecordTransactionORMStub()
  const sut = new TransactionRepository(recordTransactionORMStub, loadTransactionsByAccountIdORMStub)
  return {
    sut,
    recordTransactionORMStub,
    loadTransactionsByAccountIdORMStub
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

  describe('LoadByAccountId method', () => {
    test('Should call LoadTransactionsByAccountIdORM with correct values', async () => {
      const { sut, loadTransactionsByAccountIdORMStub } = makeSut()
      const loadByAccountIdSpy = jest.spyOn(loadTransactionsByAccountIdORMStub, 'loadByAccountId')
      await sut.loadByAccountId(1)
      expect(loadByAccountIdSpy).toHaveBeenCalledWith(1)
    })

    test('Should throw if LoadTransactionsByAccountIdORM throws', async () => {
      const { sut, loadTransactionsByAccountIdORMStub } = makeSut()
      jest.spyOn(loadTransactionsByAccountIdORMStub, 'loadByAccountId').mockReturnValueOnce(Promise.reject(new Error()))
      const record = sut.loadByAccountId(1)
      await expect(record).rejects.toThrow()
    })

    test('Should return an array of records on success', async () => {
      const { sut } = makeSut()
      const userAccount = await sut.loadByAccountId(1)
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
