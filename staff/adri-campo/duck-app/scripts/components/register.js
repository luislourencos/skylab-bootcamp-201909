function Register(container) {
    Component.call(this, container);
}

Register.extend(Component);

Register.prototype.onSubmit = function (expression) {
    this.container.addEventListener('submit', function (event) {
        event.preventDefault();
        const name = this.name.value
        const surname = this.surname.value
        const email = this.email.value
        const password = this.password.value
        expression(name, surname, email, password)

    });
};  




