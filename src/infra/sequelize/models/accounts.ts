import connection from './index'
import { CreationOptional, DataTypes, DecimalDataType, InferAttributes, InferCreationAttributes, Model } from 'sequelize'
import { Users } from './users'
import { Transactions } from './transactions'

const sequelize = connection.sequelize

export class Accounts extends Model<
InferAttributes<Accounts>,
InferCreationAttributes<Accounts>
> {
  declare id: CreationOptional<number>
  declare balance: DecimalDataType
}

Accounts.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.UUID,
      unique: true
    },
    balance: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'Accounts',
    tableName: 'Accounts'
  })

Accounts.hasOne(Users, {
  sourceKey: 'id',
  foreignKey: 'accountId',
  as: 'user'
})

Users.belongsTo(Accounts, {
  foreignKey: 'accountId',
  as: 'account'
})

Accounts.hasMany(Transactions, {
  sourceKey: 'id',
  foreignKey: 'debitedAccountId',
  as: 'debitTransaction'
})

Transactions.belongsTo(Accounts, {
  foreignKey: 'debitedAccountId',
  as: 'debitAccount'
})

Accounts.hasMany(Transactions, {
  sourceKey: 'id',
  foreignKey: 'creditedAccountId',
  as: 'creditTransaction'
})

Transactions.belongsTo(Accounts, {
  foreignKey: 'creditedAccountId',
  as: 'creditAccount'
})
