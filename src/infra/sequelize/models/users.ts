import connection from './index'
import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize'

const sequelize = connection.sequelize

export class Users extends Model<
InferAttributes<Users>,
InferCreationAttributes<Users>
> {
  declare id: CreationOptional<number>
  declare username: string
  declare password: string
  declare accountId: number
}

Users.init({
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.UUID,
    unique: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  accountId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Users'
})
