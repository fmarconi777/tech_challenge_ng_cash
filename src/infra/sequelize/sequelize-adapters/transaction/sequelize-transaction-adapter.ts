import { DecimalDataType } from 'sequelize'
import { ConnectionHelper } from '../../../db/helpers/connection-helper'
import { RecordData, RecordTransactionORM } from '../../../protocols/transaction/record-transaction-orm'
import { Accounts } from '../../models/accounts'
import { Transactions } from '../../models/transactions'

export class SequelizeTransactionAdapter implements RecordTransactionORM {
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
}
