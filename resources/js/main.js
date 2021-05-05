import axios from 'axios'
import Noty from 'noty'
import {initAdmin} from './admin'
let addTOCart = document.querySelectorAll('.add-to-cart')
let cartCounter = document.getElementById('cart-counter')
function updateCart(coffee){
    //axios call
    axios.post('/update-cart', coffee).then(res =>{
        console.log(res)
        cartCounter.innerText = res.data.totalQty
        new Noty({
            type: 'success',
            timeout: 1000,
            text: 'Item added to cart',
            progressBar:false,
            layout:'topLeft'
          }).show();
    }).catch(err => {
        new Noty({
            type: 'error',
            timeout: 1000,
            text: 'Failed to add item to cart',
            progressBar:false,
            layout:'topLeft'
          }).show();
    })
}
addTOCart.forEach((btn)=>{
    btn.addEventListener('click',(e)=>{
       let coffee = JSON.parse(btn.dataset.coffee)
       updateCart(coffee)
    })
})

const alertMsg = document.querySelector('#success-alert')
if(alertMsg){
    setTimeout(() => {
        alertMsg.remove()
    }, 2000)
}

initAdmin()