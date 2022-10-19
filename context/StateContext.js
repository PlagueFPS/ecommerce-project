import { createContext, useContext, useState } from 'react'
import toast from 'react-hot-toast'

export const Context = createContext()

export const StateContext = ({ children }) => {
  const [showCart, setShowCart] = useState(false)
  const [cartItems, setCartItems] = useState([])
  const [totalPrice, setTotalPrice] = useState(0)
  const [totalQuantities, setTotalQuantities] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [productStock, setProductStock] = useState(0)

  let foundProduct
  let index

  const onAdd = (product, qty) => {
    const checkProductInCart = cartItems.find(item => item._id === product._id)

    setTotalPrice(prevState => prevState + product.price * qty)
    setTotalQuantities(prevState => prevState + qty)

    if (checkProductInCart) {
      const updatedCartItems = cartItems.map(cartProduct => {
        if (cartProduct._id === product._id) return {
          ...cartProduct,
          quantity: cartProduct.quantity + qty
        }
      })

      setCartItems(updatedCartItems)
    } else {
      product.quantity = qty
      
      setCartItems([...cartItems, {...product}])
    }

    toast.success(`${quantity} ${product.name} added to the cart`)
  }

  const onRemove = (product) => {
    foundProduct = cartItems.find((item) => item._id === product._id)
    const filteredCartItems = cartItems.filter(item => item._id !== product._id)

    setTotalPrice(prevState => prevState - foundProduct.price * foundProduct.quantity)
    setTotalQuantities(prevState => prevState - foundProduct.quantity)
    setCartItems(filteredCartItems)
  }

  const toggleCartItemQuantity = (id, value) => {
    foundProduct = cartItems.find((item) => item._id === id)
    index = cartItems.findIndex((product) => product._id === id)
    
    const filteredCartItems = cartItems.filter(item => item._id !== id)

    if (value === 'inc') {
      let newCartItems = [...filteredCartItems, { ...foundProduct, quantity: foundProduct.quantity + 1 }]

      setCartItems(newCartItems)
      setTotalPrice(prevState => prevState + foundProduct.price)
      setTotalQuantities(prevState => prevState + 1)
    } else if (value === 'dec') {

        if (foundProduct.quantity > 1){
          let newCartItems = [...filteredCartItems, { ...foundProduct, quantity: foundProduct.quantity - 1 }]
    
          setCartItems(newCartItems)
          setTotalPrice(prevState => prevState - foundProduct.price)
          setTotalQuantities(prevState => prevState - 1)
      }

    }
  }

  const increaseQuantity = () => {
    setQuantity(prevState => prevState + 1)
  }

  const decreaseQuantity = () => {
    setQuantity(prevState => {
      if (prevState - 1 < 1) return 1

      return prevState - 1
    })
  }

  const contextValues = {
    showCart,
    cartItems,
    totalPrice,
    totalQuantities,
    quantity,
    increaseQuantity,
    decreaseQuantity,
    onAdd,
    setShowCart,
    toggleCartItemQuantity,
    onRemove,
    setCartItems,
    setTotalPrice,
    setTotalQuantities,
    productStock,
    setProductStock,
  }

  return (
    <Context.Provider value={ contextValues }>
      { children }
    </Context.Provider>
  )
}

export const useStateContext = () => useContext(Context)
