import connection from './index'
import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize'

const sequelize = connection.sequelize

export class Transactions extends Model<
InferAttributes<Transactions>,
InferCreationAttributes<Transactions>
> {
  declare id: CreationOptional<number>
  declare debitedAccountId: number
  declare creditedAccountId: number
  declare value: number
}

Transactions.init({
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.UUID,
    unique: true
  },
  debitedAccountId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  creditedAccountId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  value: {
    type: DataTypes.DECIMAL(20, 2),
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Transactions'
})
