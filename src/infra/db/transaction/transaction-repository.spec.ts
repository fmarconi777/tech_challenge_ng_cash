import {
  LoadTransactionsByAccountIdORM,
  RecordsData, RecordData,
  RecordTransactionORM, FilterValues,
  LoadFilterByCashTransactionsORM,
  LoadFilterByDateTransactionsORM
} from './transaction-repository-protocols'
import { TransactionRepository } from './transaction-repository'
import { PeriodData } from '@/data/protocols/db/transaction/load-filter-by-date-transactions-repository'

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

const periodData = {
  accountId: 1,
  startDate: '2022-01-01',
  endDate: '2022-11-01'
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

const makeLoadFilterByCashTransactionsORMStub = (): LoadFilterByCashTransactionsORM => {
  class LoadFilterByCashTransactionsORMStub implements LoadFilterByCashTransactionsORM {
    async loadByCashFilter (filterValues: FilterValues): Promise<RecordsData[]> {
      return await Promise.resolve([{
        id: 'any_id',
        debitedUsername: 'any_debitedUsername',
        creditedUsername: 'any_creditedUsername',
        value: 'any_value',
        createdAt: 'any_createdAt'
      }])
    }
  }
  return new LoadFilterByCashTransactionsORMStub()
}

const makeLoadFilterByDateTransactionsORMStub = (): LoadFilterByDateTransactionsORM => {
  class LoadFilterByDateTransactionsORMStub implements LoadFilterByDateTransactionsORM {
    async loadByFilterDate (periodData: PeriodData): Promise<RecordsData[]> {
      return await Promise.resolve([{
        id: 'any_id',
        debitedUsername: 'any_debitedUsername',
        creditedUsername: 'any_creditedUsername',
        value: 'any_value',
        createdAt: 'any_createdAt'
      }])
    }
  }
  return new LoadFilterByDateTransactionsORMStub()
}

type SubTypes = {
  sut: TransactionRepository
  recordTransactionORMStub: RecordTransactionORM
  loadTransactionsByAccountIdORMStub: LoadTransactionsByAccountIdORM
  loadFilterByCashTransactionsORMStub: LoadFilterByCashTransactionsORM
  loadFilterByDateTransactionsORMStub: LoadFilterByDateTransactionsORM
}

const makeSut = (): SubTypes => {
  const loadFilterByDateTransactionsORMStub = makeLoadFilterByDateTransactionsORMStub()
  const loadFilterByCashTransactionsORMStub = makeLoadFilterByCashTransactionsORMStub()
  const loadTransactionsByAccountIdORMStub = makeLoadTransactionsByAccountIdORMStub()
  const recordTransactionORMStub = makeRecordTransactionORMStub()
  const sut = new TransactionRepository(recordTransactionORMStub, loadTransactionsByAccountIdORMStub, loadFilterByCashTransactionsORMStub, loadFilterByDateTransactionsORMStub)
  return {
    sut,
    recordTransactionORMStub,
    loadTransactionsByAccountIdORMStub,
    loadFilterByCashTransactionsORMStub,
    loadFilterByDateTransactionsORMStub
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
    test('Should call LoadFilterByCashTransactionsORM with correct values', async () => {
      const { sut, loadFilterByCashTransactionsORMStub } = makeSut()
      const loadByCashFilterSpy = jest.spyOn(loadFilterByCashTransactionsORMStub, 'loadByCashFilter')
      await sut.loadByFilter(filterValues)
      expect(loadByCashFilterSpy).toHaveBeenCalledWith(filterValues)
    })

    test('Should throw if LoadFilterByCashTransactionsORM throws', async () => {
      const { sut, loadFilterByCashTransactionsORMStub } = makeSut()
      jest.spyOn(loadFilterByCashTransactionsORMStub, 'loadByCashFilter').mockReturnValueOnce(Promise.reject(new Error()))
      const record = sut.loadByFilter(filterValues)
      await expect(record).rejects.toThrow()
    })

    test('Should return an array of records on success', async () => {
      const { sut } = makeSut()
      const userAccount = await sut.loadByFilter(filterValues)
      expect(userAccount).toEqual([{
        id: 'any_id',
        debitedUsername: 'any_debitedUsername',
        creditedUsername: 'any_creditedUsername',
        value: 'any_value',
        createdAt: 'any_createdAt'
      }])
    })
  })

  describe('loadByFilterDate method', () => {
    test('Should call LoadFilterByDateTransactionsORM with correct values', async () => {
      const { sut, loadFilterByDateTransactionsORMStub } = makeSut()
      const loadByFilterDateSpy = jest.spyOn(loadFilterByDateTransactionsORMStub, 'loadByFilterDate')
      await sut.loadByFilterDate(periodData)
      expect(loadByFilterDateSpy).toHaveBeenCalledWith(periodData)
    })

    test('Should throw if LoadFilterByDateTransactionsORM throws', async () => {
      const { sut, loadFilterByDateTransactionsORMStub } = makeSut()
      jest.spyOn(loadFilterByDateTransactionsORMStub, 'loadByFilterDate').mockReturnValueOnce(Promise.reject(new Error()))
      const record = sut.loadByFilterDate(periodData)
      await expect(record).rejects.toThrow()
    })

    test('Should return an array of records on success', async () => {
      const { sut } = makeSut()
      const userAccount = await sut.loadByFilterDate(periodData)
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
