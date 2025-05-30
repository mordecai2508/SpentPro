export default class Goal {
  constructor(id, amount, period, progress = 0) {
    this.id = id;
    this.amount = amount;
    this.period = period; // 'semanal', 'mensual', 'anual'
    this.progress = progress;
  }
}