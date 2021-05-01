const Menu = require('../../models/menu')
function homeController(){
    return {
        async index(req, res) {
            const coffees = await Menu.find()
            return res.render('home', {coffees: coffees}) 
            // }

            // Menu.find().then(function(coffee){
            //     console.log(coffee)
            //     return res.render('home', {coffee: coffee}) 
            // })
        }
    }
}

module.exports = homeController