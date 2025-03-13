const calculateTotal=(products)=>{
    return products.reduce((total,item)=>total+item.product.price*item.quantity,0)
}

export default calculateTotal