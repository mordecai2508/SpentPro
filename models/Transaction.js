export default class Transaction {
  constructor(id, type, amount, date, categoryId, notes) {
    this.id = id; // único
    this.type = type; // 'ingreso' o 'gasto'
    this.amount = amount;
    this.date = date; // formato ISO string
    this.categoryId = categoryId;
    this.notes = notes;
  }
}