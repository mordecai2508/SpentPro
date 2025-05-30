export default class User {
  constructor(id, password, securityQuestion, securityAnswer, nombre, apellidos, correo) {
    this.id = id;
    this.password = password;
    this.securityQuestion = securityQuestion;
    this.securityAnswer = securityAnswer;
    this.nombre = nombre;
    this.apellidos = apellidos;
    this.correo = correo; // ahora es el identificador único
  }
}