import { LoadTransactionsByAccountIdORM, RecordsData, RecordData, RecordTransactionORM } from '../sequelize-adapters-protocols'
import { parseRecords } from '../sequelize-parsers/parse-records'
import { Accounts, Transactions } from '@/infra/sequelize/models/models'
import { ConnectionHelper } from '@/infra/db/helpers/connection-helper'
import { FilterValues, LoadFilterByCashTransactionsORM } from '@/infra/protocols/transaction/load-filter-by-cash-transactions-ORM'
import { LoadFilterByDateTransactionsORM } from '@/infra/protocols/transaction/load-filter-by-date-transactions-orm'
import { PeriodData } from '@/data/protocols/db/transaction/load-filter-by-date-transactions-repository'
import { DecimalDataType, QueryTypes } from 'sequelize'

export class SequelizeTransactionAdapter implements RecordTransactionORM,
LoadTransactionsByAccountIdORM,
LoadFilterByCashTransactionsORM,
LoadFilterByDateTransactionsORM {
  async record (recordData: RecordData): Promise<string> {
    await ConnectionHelper.reconnect()
    let transaction
    try {
      transaction = await ConnectionHelper.client.transaction()

      const { debitedAccountId, debitedBalance, creditedAccountId, creditedBalance, value } = recordData
      await Accounts.update({ balance: debitedBalance as unknown as DecimalDataType }, { where: { id: debitedAccountId }, transaction })
      await Accounts.update({ balance: creditedBalance as unknown as DecimalDataType }, { where: { id: creditedAccountId }, transaction })

      await Transactions.create({
        debitedAccountId,
        creditedAccountId,
        value
      }, { transaction })

      await transaction.commit()

      return 'Transaction succesfully recorded'
    } catch (error) {
      if (transaction) {
        await transaction.rollback()
      }
      throw error
    }
  }

  async loadByAccountId (id: number): Promise<RecordsData[]> {
    await ConnectionHelper.reconnect()
    const records = await Transactions.sequelize?.query(
      'SELECT T.ID, ' +
          'U.USERNAME as debitedUsername, ' +
          'T.USERNAME as creditedUsername, ' +
          'T."value", ' +
          'T."createdAt" ' +
      'FROM ' +
          '(SELECT T.ID, ' +
                  'T."debitedAccountId", ' +
                  'U.USERNAME, ' +
                  'T."value", ' +
                  'T."createdAt" ' +
              'FROM PUBLIC."Transactions" T ' +
              'INNER JOIN PUBLIC."Users" U ON T."creditedAccountId" = U."accountId" ' +
              'WHERE T."debitedAccountId" = :id ' +
                  'OR T."creditedAccountId" = :id) T ' +
      'INNER JOIN PUBLIC."Users" U ON T."debitedAccountId" = U."accountId"' +
      'ORDER BY "createdAt" ASC',
      { replacements: { id }, type: QueryTypes.SELECT, raw: true }
    ) as any
    return parseRecords(records)
  }

  async loadByCashFilter (filterValues: FilterValues): Promise<RecordsData[]> {
    await ConnectionHelper.reconnect()
    const id = filterValues.accountId
    const records = await Transactions.sequelize?.query(
      'SELECT T.ID, ' +
          'U.USERNAME as debitedUsername, ' +
          'T.USERNAME as creditedUsername, ' +
          'T."value", ' +
          'T."createdAt" ' +
      'FROM ' +
          '(SELECT T.ID, ' +
                  'T."debitedAccountId", ' +
                  'U.USERNAME, ' +
                  'T."value", ' +
                  'T."createdAt" ' +
              'FROM PUBLIC."Transactions" T ' +
              'INNER JOIN PUBLIC."Users" U ON T."creditedAccountId" = U."accountId" ' +
              `WHERE T."${filterValues.filter}" = :id) T ` +
      'INNER JOIN PUBLIC."Users" U ON T."debitedAccountId" = U."accountId"' +
      'ORDER BY "createdAt" ASC',
      { replacements: { id }, type: QueryTypes.SELECT, raw: true }
    ) as any
    return parseRecords(records)
  }

  async loadByFilterDate (periodData: PeriodData): Promise<RecordsData[]> {
    await ConnectionHelper.reconnect()
    const id = periodData.accountId
    const startDate = periodData.startDate
    const endDate = periodData.endDate + ' 23:59'
    const records = await Transactions.sequelize?.query(
      'SELECT T.ID, ' +
          'U.USERNAME as debitedUsername, ' +
          'T.USERNAME as creditedUsername, ' +
          'T."value", ' +
          'T."createdAt" ' +
      'FROM ' +
          '(SELECT T.ID, ' +
                  'T."debitedAccountId", ' +
                  'U.USERNAME, ' +
                  'T."value", ' +
                  'T."createdAt" ' +
              'FROM PUBLIC."Transactions" T ' +
              'INNER JOIN PUBLIC."Users" U ON T."creditedAccountId" = U."accountId" ' +
              'WHERE T."debitedAccountId" = :id ' +
                  'OR T."creditedAccountId" = :id) T ' +
      'INNER JOIN PUBLIC."Users" U ON T."debitedAccountId" = U."accountId" ' +
      'WHERE T."createdAt" >= :startDate ' +
          'AND T."createdAt" <= :endDate ' +
      'ORDER BY "createdAt" ASC',
      { replacements: { id, startDate, endDate }, type: QueryTypes.SELECT, raw: true }
    ) as any
    return parseRecords(records)
  }
}
