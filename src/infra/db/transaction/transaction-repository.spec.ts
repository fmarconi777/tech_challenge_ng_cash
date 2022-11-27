import { LoadTransactionsByAccountIdORM, RecordsData, RecordData, RecordTransactionORM, FilterValues, LoadFilteredCashTransactionsORM } from './transaction-repository-protocols'
import { TransactionRepository } from './transaction-repository'

const recordData = {
  debitedAccountId: 1,
  debitedBalance: 0.00,
  creditedAccountId: 2,
  creditedBalance: 200.00,
  value: 100.00
}

const filterValues = {
  accountId: 1,
  filter: 'creditedAccountId'
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

const makeLoadFilteredCashTransactionsORMStub = (): LoadFilteredCashTransactionsORM => {
  class LoadFilteredCashTransactionsORMStub implements LoadFilteredCashTransactionsORM {
    async loadByFilter (filterValues: FilterValues): Promise<RecordsData[]> {
      return await Promise.resolve([{
        id: 'any_id',
        debitedUsername: 'any_debitedUsername',
        creditedUsername: 'any_creditedUsername',
        value: 'any_value',
        createdAt: 'any_createdAt'
      }])
    }
  }
  return new LoadFilteredCashTransactionsORMStub()
}

type SubTypes = {
  sut: TransactionRepository
  recordTransactionORMStub: RecordTransactionORM
  loadTransactionsByAccountIdORMStub: LoadTransactionsByAccountIdORM
  loadFilteredCashTransactionsORMStub: LoadFilteredCashTransactionsORM
}

const makeSut = (): SubTypes => {
  const loadFilteredCashTransactionsORMStub = makeLoadFilteredCashTransactionsORMStub()
  const loadTransactionsByAccountIdORMStub = makeLoadTransactionsByAccountIdORMStub()
  const recordTransactionORMStub = makeRecordTransactionORMStub()
  const sut = new TransactionRepository(recordTransactionORMStub, loadTransactionsByAccountIdORMStub, loadFilteredCashTransactionsORMStub)
  return {
    sut,
    recordTransactionORMStub,
    loadTransactionsByAccountIdORMStub,
    loadFilteredCashTransactionsORMStub
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

  describe('LoadByFilter method', () => {
    test('Should call LoadFilteredCashTransactionsORM with correct values', async () => {
      const { sut, loadFilteredCashTransactionsORMStub } = makeSut()
      const loadByFilterSpy = jest.spyOn(loadFilteredCashTransactionsORMStub, 'loadByFilter')
      await sut.loadByFilter(filterValues)
      expect(loadByFilterSpy).toHaveBeenCalledWith(filterValues)
    })
  })

  test('Should throw if LoadFilteredCashTransactionsORM throws', async () => {
    const { sut, loadFilteredCashTransactionsORMStub } = makeSut()
    jest.spyOn(loadFilteredCashTransactionsORMStub, 'loadByFilter').mockReturnValueOnce(Promise.reject(new Error()))
    const record = sut.loadByFilter(filterValues)
    await expect(record).rejects.toThrow()
  })
})
