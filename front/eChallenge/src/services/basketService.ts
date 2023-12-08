import { ref } from 'vue';
import { apiService } from './apiService';
const BASKET_STORAGE_KEY = 'basket';

const basketData = localStorage.getItem(BASKET_STORAGE_KEY);
const basket:any = ref({
  basketId: null,
  products: [],
});

basket.value = JSON.parse(basketData);
const saveBasketToLocalStorage = () => {
    localStorage.setItem(BASKET_STORAGE_KEY, JSON.stringify(basket.value));
  };

const checkAndAddToBasket = async (product, quantity = 1) => {
    try {
      //check first quantity if no qty return err
      //to check qty just get by id product and check qty
      //if ok continue process else return err and display modal
      const response = await fetch(`${import.meta.env.VITE_API_URL}/products/${product._id}`);
      const productDetails = await response.json();
      console.log("PRODUCT DETAIL : ", productDetails)
      if (productDetails.stock <= 0) {
        console.error('Product is out of stock.');
        return false;
      }
      const basketData = localStorage.getItem(BASKET_STORAGE_KEY);
      if (basketData !== null) {
         basket.value = JSON.parse(basketData);
      } else {
        basket.value = {basketId: null, products:[]}
     }
      if (basket.value && basket.value.basketId) {
        await addToBasketBackend(product, quantity, basket.value.basketId);
      } else {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/baskets`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          basket.value.basketId = data.id;
        } else {
          console.error('Failed to initialize basket on the backend');
        }
      }
      saveBasketToLocalStorage();
      return true;
    } catch (error) {
      console.error('Error checking and adding to basket:', error);
    }
  };
  
  const addToBasketBackend = async (productData, quantity, basketId) => {
    try {
    const existingProductIndex = basket.value.products.findIndex((product:any) => product.productData._id === productData._id);
    if (existingProductIndex !== -1) {
      const existingProduct:any = basket.value.products[existingProductIndex];
      existingProduct.quantity += quantity;
       await fetch(`${import.meta.env.VITE_API_URL}/productsbaskets/${existingProduct.productBasketId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quantity: existingProduct.quantity,
        }),
      });
      console.log('Quantité mise à jour pour le produit existant');
    } else {
      // Le produit n'existe pas, ajouter une nouvelle entrée dans le panier
    const response = await fetch(`${import.meta.env.VITE_API_URL}/productsbaskets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quantity: 1,
          movement: "reservation",
          ProductId: productData._id,
          BasketId: basketId
        }),
      });
        // Extraire l'ID du produit ajouté à partir de la réponse
    const productBasketData = await response.json();
    const productBasketId = productBasketData.id;

    // Mettre à jour le panier côté frontend avec l'ID du produit ajouté
    basket.value.products.push({ productData, quantity, productBasketId });
    }
    saveBasketToLocalStorage();
  }catch(err){
    console.log("ERROR BASKET ADD : ", err)
  }
 };

 const removeFromBasket = async(productData) => {
    try{
      const basketData = localStorage.getItem(BASKET_STORAGE_KEY);
      if (basketData !== null) {
         basket.value = JSON.parse(basketData);
      } else {
        basket.value = {basketId: null, products:[]}
     }
    const productIndex = basket.value.products.findIndex(product => product.productData._id === productData._id);
        console.log(basket.value.products)
        console.log(productIndex)
        console
    if (productIndex !== -1) {
      if (basket.value.products[productIndex].quantity > 1) {
        const existingProduct = basket.value.products[productIndex];
        existingProduct.quantity -= 1;
        await fetch(`${import.meta.env.VITE_API_URL}/productsbaskets/${existingProduct.productBasketId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quantity: basket.value.products[productIndex].quantity - 1,
        }),
      });
        console.log('Quantité décrémentée pour le produit');
      } else {
        // La quantité est égale à 1, supprimer l'entrée du panier
        const productBasketId = basket.value.products[productIndex].productBasketId;
        basket.value.products.splice(productIndex, 1);
        await fetch(`${import.meta.env.VITE_API_URL}/productsbaskets/${productBasketId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
        console.log('Entrée du panier supprimée');
      }
      saveBasketToLocalStorage();
    }
}catch(err){
    console.log("ERR REMOVE BASKET : ", err)
}
  };

export  { basket, checkAndAddToBasket, addToBasketBackend, removeFromBasket };
