import { RecordsData } from '../sequelize-adapters-protocols'

export const parseRecords = (records: any): RecordsData[] => {
  const recordsData = []
  if (records) {
    for (const record of records) {
      recordsData.push({
        id: String(record.id),
        debitedUsername: record.debitedusername,
        creditedUsername: record.creditedusername,
        value: record.value,
        createdAt: record.createdAt
      })
    }
  }
  return recordsData
}
