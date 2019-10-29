const { Component } = React

class App extends Component {

    state = { view: 'landing', error: undefined, result: undefined}

    handleGoToRegistration = () => {
        this.setState({view: 'register'})
    }

    handleGoToLogin = () => {
        this.setState({view: 'login'})
    }

    handleRegister = (name, surname, email, password) => {
        //llamamos a la lógica
        try {
            registerUser(name, surname, email, password, (error, data) => {

                if(error) {
                    this.setState({error: error.message})
                }
                else {
                    this.setState({view: 'login'})
                }

            })
        } catch (error) {
            
            this.setState({error: error.message})
        }
    }

    handleLogin = (email, password) => {

        try {
            authenticateUser(email,password, (error, result) => {
                if(error) {
                    this.setState({error: error.message})
                }
                else {
                    
                    this.setState({view: 'landing', result})
                }
            }) 
        }
        catch (error) {
            this.setState({error: error.message})
        }   
    }

    handleLogout = () => {
        console.log('ha entrado a logout')
    }

    handleFavCar = () => {
        console.log('ha entrado a FavCar')
    }

    handleProfile = () => {
        console.log('ha entrado a Profile')
    }

    render() {
        //declaramos las variables y asignamos a scope de App

        const {state: {view, error, result}, handleGoToRegistration, handleGoToLogin, handleRegister, handleLogin, handleLogout, handleFavCar, handleProfile} = this
    
        return <>
            
            {view === 'landing' && <Header onRegister={handleGoToRegistration} onLogin = {handleGoToLogin} result = {result} onLogout = {handleLogout} onFavCar = {handleFavCar} onProfile = {handleProfile} />}
            {view === 'register' && <Register onRegister={handleRegister} error = {error}/>}
            
            {view === 'login' && <Login onLogin = {handleLogin} error = {error} />}


        
        </>
    }

}