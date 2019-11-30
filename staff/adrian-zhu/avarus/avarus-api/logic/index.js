module.exports = {
    // User
    authenticateUser: require('./user/authenticate-user'),
    registerUser: require('./user/register-user'),
    retrieveUser: require('./user/retrieve-user'),
    editUser: require('./user/edit-user'),
    deleteUser: require('./user/delete-user'),
    deleteStock: require('./user/delete-stock'),
    AddFavorite: require('./user/favorite-user'),
    buyIn: require('./user/buy-in-stock'),
    sellOut: require('./user/sell-out-stock'),

    // Company
    createCompany: require('./company/create-company'),
    createPrice: require('./company/create-price'),
    authenticateCompany: require('./company/authenticate-company'),
    retrieveCompanies: require('./company/retrieve-companies'),
    retrieveCompany: require('./company/retrieve-company'),
    retrievePrice: require('./company/retrieve-price'),
    editCompany: require('./company/edit-company')

}