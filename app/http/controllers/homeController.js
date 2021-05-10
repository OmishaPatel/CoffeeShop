const Menu = require('../../models/menu')
function homeController(){
    return {
        async index(req, res) {
            const coffees = await Menu.find()
            return res.render('home', {coffees: coffees}) 

        }
    }
}

module.exports = homeController