export default class Category {
  constructor(id, name, isCustom = false) {
    this.id = id;
    this.name = name;
    this.isCustom = isCustom; // true si es personalizada
  }
}