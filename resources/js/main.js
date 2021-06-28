import axios from 'axios'
import Noty from 'noty'
import {initAdmin} from './admin'
import moment from 'moment'

let addTOCart = document.querySelectorAll('.add-to-cart')
let cartCounter = document.getElementById('cart-counter')
let removeCart = document.querySelectorAll('.delete-button')
let addItemToCart = document.querySelectorAll('.add-button')
let totalCounter = document.getElementById('total-counter')
const options = {
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin' : '*'
    }
  };
function updateCart(coffee){
    //axios call
    axios.post('/update-cart', coffee).then(res =>{
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
    console.log(coffee)
    updateCart(coffee)
    })
})
function removeItems(item) {
    axios.post('/delete-cart',item,options).then(res =>{
        cartCounter.innerText = res.data.totalQty//totalCounter.innerText = res.data.totalPrice
        new Noty({
            type: 'success',
            timeout: 1000,
            text: 'Item removed from cart. Please refresh page to see changes.',
            progressBar:false,
            layout:'topLeft'
          }).show();
    }).catch(err => {
        new Noty({
            type: 'error',
            timeout: 1000,
            text: 'Failed to remove item from cart',
            progressBar:false,
            layout:'topLeft'
          }).show();
    })
}
removeCart.forEach((btn) => {
    btn.addEventListener('click',(e)=>{
        let item = JSON.parse(btn.dataset.id)
        console.log(item)
        removeItems(item)
        
        })
    })
function addItem(item) {
    axios.post('/add-cart', item, options).then(res =>{
        cartCounter.innerText = res.data.totalQty
        new Noty({
            type: 'success',
            timeout: 1000,
            text: 'Item added to cart. Please refresh page to see changes.',
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
addItemToCart.forEach((btn)=> {
    btn.addEventListener('click',(e)=>{
    let item = JSON.parse(btn.dataset.id)
    addItem(item)
    })
})
const alertMsg = document.querySelector('#success-alert')
if(alertMsg){
    setTimeout(() => {
        alertMsg.remove()
    }, 2000)
}


// changing render status
let status = document.querySelectorAll('.status-line')
let hiddenInput = document.querySelector('#hiddenInput')
let order = hiddenInput ? document.querySelector('#hiddenInput').value : null
order = JSON.parse(order)

let time = document.createElement('small')

function updateStatus(order) {
    //
    status.forEach((item)=> {
        item.classList.remove('step-completed')
        item.classList.remove('current') 
    })
    let stepCompleted = true;
    status.forEach((item) => {
        let dataProp = item.dataset.status
        if(stepCompleted){
            item.classList.add('step-completed')
        }
        if(dataProp === order.status){
            stepCompleted = false;
            time.innerText = moment(order.updatedAt).format('hh:mm A')
            item.appendChild(time)
            if(item.nextElementSibling){
                item.nextElementSibling.classList.add('current') 
            }
        }
    })
}

updateStatus(order);
// Socket 
let socket = io()


// Join
if(order){
    socket.emit('join', `order_${order._id}`)
}

let adminArea = window.location.pathname
if(adminArea.includes('admin')) {
    initAdmin(socket)
    socket.emit('join','adminRoom')
}

socket.on('orderUpdated', (data) => {
    const updatedOrder = { ...order }
    updatedOrder.updatedAt = moment().format()
    updatedOrder.status = data.status
    updateStatus(data)
    new Noty({
        type: 'success',
        timeout: 1000,
        text: 'Order updated',
        progressBar:false,
        layout:'topLeft'
      }).show();
})