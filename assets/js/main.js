// LOAD ALL JSONS IN LOCAL STORAGE
    const beers = fetchLocalStorage('beers')
    const breweries = fetchLocalStorage('breweries')
    const types = fetchLocalStorage('types')
    const percentages = fetchLocalStorage('alc-percentage')

    async function fetchData(fileName) {
        try {
            res = await fetch(`./assets/data/${fileName}.json`)
            return res.json()
        } catch (error) {
            console.error(error)
        }
    }

    function fetchLocalStorage(file) {
        fetchData(file).then(instance => {
            localStorage.setItem(file, JSON.stringify(instance))
        })
        return JSON.parse(localStorage.getItem(file))
    }
// END OF LOAD ALL JSONS IN LOCAL STORAGE

// LOADING OF ESSENTIALS
    if(window.location.pathname === '/worldCraft/shop.html') shopPage()
    if(window.location.pathname === '/worldCraft/about.html') contactValidation()
// END OF LOADING ESSENTIALS

// SHOP PAGE
    function shopPage() {
        loadBeers(beers)
        loadFilters(breweries, 'brandFilter', 'beerBrand')
        loadFilters(types, 'typeFilter', 'beerType')
        loadFilters(percentages, 'alcFilter', 'beerAlcohol')
        
        function filterByBrewery(beerArray) {
            let chosenBreweryIds = []
            let chosenBreweries = document.querySelectorAll('input[name="beerBrand"]:checked')
            
            chosenBreweries.forEach(brewery => {
                chosenBreweryIds.push(Number(brewery.value))
            })
            
            if(chosenBreweryIds.length) {
                return beerArray.filter(beer => 
                    chosenBreweryIds.includes(beer.brewery)    
                )
            }
            
            return beerArray
        }
        
        function filterByType(beerArray) {
            let chosenTypeIds = []
            let chosenTypes = document.querySelectorAll('input[name="beerType"]:checked')
            
            chosenTypes.forEach(type => {
                chosenTypeIds.push(Number(type.value))
            })
        
            if(chosenTypeIds.length) {
                return beerArray.filter(beer => 
                    beer.types.some(type => 
                        chosenTypeIds.includes(type)    
                    ) 
                )
            }
            
            return beerArray
        }
        
        function filterByPercentage(beerArray) {
            let chosenPercentageIds = []
            let chosenPercentages = document.querySelectorAll('input[name="beerAlcohol"]:checked')
            
            chosenPercentages.forEach(percentage => {
                chosenPercentageIds.push(Number(percentage.value))
            })
        
            if(chosenPercentageIds.length) {
                return beerArray.filter(beer => 
                    chosenPercentageIds.includes(beer.alcoholPercentage.percentageRange)    
                )
            }
            
            return beerArray
        }

        document.getElementById('sortSelect').addEventListener('change', beersFiltered)

        function sortBeers(beerArray) {
            let sortType = document.getElementById('sortSelect').value
            switch(sortType) {
                case 'namedesc': 
                        return beerArray.sort((previous, next) =>
                            previous.beerName < next.beerName ? 1 : -1
                        )
                case 'priceasc': 
                        return beerArray.sort((previous, next) =>
                            previous.price > next.price ? 1 : -1
                        )
                case 'pricedesc': 
                        return beerArray.sort((previous, next) =>
                        previous.price < next.price ? 1 : -1
                        )
                default: 
                        return beerArray.sort((previous, next) =>
                            previous.beerName > next.beerName ? 1 : -1
                        )
            }
        }

        document.getElementById('searchBeer').addEventListener('keyup', beersFiltered)

        function searchBeer(beerArray){
            let searchBeerValue = document.getElementById('searchBeer').value.toLowerCase()

            if(searchBeerValue) {
                return beerArray.filter(beer => {
                    return beer.beerName.toLowerCase().indexOf(searchBeerValue) !== -1
                })
            }

            return beerArray
        }
        
        function loadFilters(filtersArray, filterContainer, filterName) {
            const filterList = document.getElementById(filterContainer)
            let filterItems = ''
        
            for(let filter of filtersArray) {
                filterItems += `
                    <li>
                        <label>
                            <input type="checkbox" name="${filterName}" value="${filter.id}" />
                            <span>${filter.title}</span>
                        </label>
                    </li>
                `
            }
            filterList.innerHTML = filterItems

            document.querySelectorAll(`input[name="${filterName}"]`).forEach(box => {
                box.addEventListener('change', beersFiltered)
            })
        }

        function beersFiltered() {
            loadBeers(beers)
        }
        
        function loadBeers(beerArray) {
            beerArray = filterByBrewery(beerArray)
            beerArray = filterByType(beerArray)
            beerArray = filterByPercentage(beerArray)
            beerArray = searchBeer(beerArray)
            beerArray = sortBeers(beerArray)

            const beerContainer = document.getElementById('beerContainer')
            let beerCard = ''
            
            for(let beer of beerArray) {
                beerCard += `
                    <div class="col s12 m6 l3">
                        <div class="card">
                            <div class="card-image">
                                <img class="product-image" src="./assets/img/beers/${beer.beerCover.location}" alt="${beer.beerCover.alternative}">
                                <a class="halfway-fab btn-floating orange add-to-favorites"><i class="material-icons">favorite</i></a>
                            </div>
                            <div class="card-content">
                                <span class="card-title activator grey-text text-darken-4">${beer.beerName}<i class="material-icons right">more_vert</i></span>
                                <p class="small-text pt-1">${showBrand(beer.brewery)}</p>
                                <p class="small-text pt-1">${showTypes(beer.types)}</p>
                                <p class="small-text pt-1">Alc. % ${beer.alcoholPercentage.percentage}</p>
                                <p id="beer-price" class="pt-2 center">&euro; ${beer.price}</p>
                            </div>
                            <div class="center card-action">
                                <a class="add-to-cart">Add To Cart</a>
                            </div>
                            <div class="card-reveal">
                                <span class="card-title grey-text text-darken-4 mb">${beer.beerName}<i class="material-icons right">close</i></span>
                                <p>
                                    ${beer.beerDescription}
                                </p>
                            </div>
                        </div>
                    </div> 
                `
            }

            beerContainer.innerHTML = (beerCard) ? beerCard : `<h3 class="grey-text lighten-5">Ooops, no beers found!</h3>` 

            document.querySelectorAll('.add-to-favorites').forEach(btn => {
                btn.addEventListener('click', addToFavorites)
            })

            document.querySelectorAll('.add-to-cart').forEach(btn => {
                btn.addEventListener('click', addToCart)
            })
        }
        
        function showTypes(typeIds) {
            let typesOutput = ''
        
            for(let position in typeIds) {
                for(let type of types) {
                    if(typeIds[position] === type.id) {
                        if(position < typeIds.length - 1) {
                            typesOutput += `${type.title}, ` 
                        } else {
                            typesOutput += `${type.title}`
                        }
                    }
                }
            }
        
            return typesOutput
        } 
        
        function showBrand(brandId) {
            for(let brewery of breweries) {
                if(brandId === brewery.id) return brewery.title
            }
        }
                
        function clearAllFilters() {
            document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
                checkbox.checked = false
            })
            document.querySelector('input').value = ''
            document.getElementById('clearFilters').disabled = true
            document.getElementById('sortSelect').selectedIndex = 0
            loadBeers(beers)
        }
        
        document.getElementById('clearFilters').addEventListener('click', () => {
            if(!this.disabled) clearAllFilters()
        })
        
        document.querySelectorAll('input:not(.quantity)').forEach(element => {
            const clearBtn = document.getElementById('clearFilters')
            element.addEventListener('change', () => {
                if(clearBtn.disabled) clearBtn.disabled = false 
            })
        })   
    }
// END OF SHOP PAGE

// FAVORITES
    function addToFavorites(clickedBeer) {
        let targetBeer = clickedBeer.target.parentElement.parentElement.parentElement
        let beerInfo = []
        let beerNameHolder = targetBeer.children[1].children[0].innerHTML
        let theName = beerNameHolder.substring(0, beerNameHolder.indexOf('<'))
        let imgSource = targetBeer.firstElementChild.firstElementChild.getAttribute('src')

        if(!checkRepeat(theName)) {
            M.toast({html: 'Beer is already in favorites!'})
        } else {
            M.toast({html: 'Beer added to favorites!'})
            beerInfo.push(imgSource, theName)
            Favorites.addFavorite(beerInfo)
            Favorites.displayFavorites()
        }
    }

    function displayFavorites(favoritesArray) {
        const favoritesContainer = document.getElementById('favorites-container')
        let favoriteBeer = ''

        for(let beer of favoritesArray) {
            favoriteBeer += `
                <li>
                    <div class="row center">
                        <div class="col s8 offset-s2 offset-m2 offset-l2">
                            <img src="${beer[0]}" class="responsive-img" alt="Favorite beer" />
                        </div>
                        <div class="col s8 pt-1">
                            <h6>${beer[1]}</h6>
                        </div>
                        <div class="col s4 pt-1">
                            <a class="remove-favorite"><i class="orange-text material-icons">close</i></a>
                        </div>
                    </div>
                </li>
                <li><div class="divider"></div></li>
            `
        }
        
        if(favoriteBeer) {
            favoritesContainer.innerHTML = favoriteBeer
            document.getElementById('removeAllFavorites').parentElement.className = 'show'
        } else {
            favoritesContainer.innerHTML = 'No favorites added yet!'
            document.getElementById('removeAllFavorites').parentElement.className = 'hide'
        }
        
        document.querySelectorAll('.remove-favorite').forEach(removeBtn => {
            removeBtn.addEventListener('click', removeFromFavorites)
        })
    }  
    
    document.getElementById('removeAllFavorites').addEventListener('click', removeAllFavorites)
    
    function removeAllFavorites() {
        localStorage.removeItem('favorites')
        Favorites.displayFavorites()
    }

    function removeFromFavorites(clickedBeer) {
        let targetBeer = clickedBeer.target.parentElement.parentElement.parentElement
        let targetName = targetBeer.children[1].children[0].innerText
        M.toast({html: 'Beer removed from favorites!'})
        Favorites.removeFavorite(targetName)
    }

    function checkRepeat(name) {
        let favorites = Favorites.getFavorite()

        for(let i = 0; i < favorites.length; i++) {
            if(favorites[i][1] === name) return 0
        }

        return 1
    }

    class Favorites {
        static getFavorite() {
            let favorites = localStorage.getItem('favorites')
            if(favorites === null) {
                favorites = []
            } 
            else {
                favorites = JSON.parse(localStorage.getItem('favorites'))
            }
            updateFavoritesInfo(favorites)
            return favorites
        }

        static removeFavorite(notFavorite) {
            let favorites = Favorites.getFavorite()
            
            for(let index in favorites) {
                if(favorites[index][1] === notFavorite) {
                    favorites.splice(index, 1)
                }
            }

            localStorage.setItem('favorites', JSON.stringify(favorites))
            Favorites.displayFavorites()
        }

        static displayFavorites() {
            let favorites = Favorites.getFavorite()
            displayFavorites(favorites)
        }

        static addFavorite(beerInfo) {
            let favorites = Favorites.getFavorite()
            favorites.push(beerInfo)
            localStorage.setItem('favorites', JSON.stringify(favorites))
        }
    }

    function updateFavoritesInfo(items) {
        document.getElementById('favorite-info').innerText = items.length
    }

    document.addEventListener('DOMContentLoaded', Favorites.displayFavorites)
// END OF FAVORITES

// SHOPPING CART
    function updateCartTotal() {
        const totalContainer = document.getElementById('cartTotal')
        const beerQuantity = document.getElementsByName('beerQuantity')
        let cartItems = Cart.getCartItems()
        let cartTotal = 0

        cartItems.forEach((item, index) => {
            cartTotal += item[2] * item[3]
        })

        cartTotal = Math.abs(Math.round(cartTotal * 100) / 100)

        totalContainer.innerHTML = cartTotal ? ` - &euro;${cartTotal}` : ``
    }

    function quantityChanged(target) {
        let quantityInput = target
        let beer = quantityInput.parentElement.parentElement.firstElementChild.innerText
        let beerQuantity = target.value
        let cartItems = Cart.getCartItems()
        let targetArray = cartItems.filter(item => item.includes(beer))

        if(beerQuantity < 1 || isNaN(beerQuantity)) {
            target.value = 1
            beerQuantity = 1
        }

        for(let index in cartItems) {
            if(cartItems[index][1] === targetArray[0][1]) {
                cartItems[index][3] = Number(beerQuantity)
            }
        }
        localStorage.setItem('cartItems', JSON.stringify(cartItems))
        displayReceiptItems(cartItems)
        updateCartTotal()
    }

    function addToCart(clickedBeer) {
        let beerInfo = []
        let targetBeer = clickedBeer.target.parentElement.parentElement
        let beerNameHolder = targetBeer.children[1].children[0].innerHTML
        let theName = beerNameHolder.substring(0, beerNameHolder.indexOf('<'))
        let imgSource = targetBeer.children[0].children[0].getAttribute('src')
        let actualPrice = targetBeer.children[1].children[4].textContent
        let beerPrice = Number(actualPrice.substring(2, actualPrice.length)) 

        if(!checkItemRepeat(theName)) {
            M.toast({html: 'Beer is already in cart!'})
        } else {
            M.toast({html: 'Beer added to cart!'})
            beerInfo.push(imgSource, theName, beerPrice, 1)
            Cart.addCartItems(beerInfo)
            Cart.displayCartItems()
        }
    }

    function checkItemRepeat(name) {
        let cartItems = Cart.getCartItems()

        for(let i = 0; i < cartItems.length; i++) {
            if(cartItems[i][1] === name) return 0
        }

        return 1
    }

    function displayCartItems(itemsArray) {
        const cartContainer = document.getElementById('cart-container')
        let cartItem = ''

        for(let index in itemsArray) {
            cartItem += `
                    <li>
                        <div class="row">
                            <div class="col s8 offset-s2 offset-m2 offset-l2">
                                <img src="${itemsArray[index][0]}" class="responsive-img" alt="Beer in cart" />
                            </div>
                        </div>
                        <div class="row valign-wrapper">
                            <div class="col s6 pt-1">
                                <h6>${itemsArray[index][1]}</h6>
                            </div>
                            <div class="col s4 pt-1">
                                <input type="number" class="quantity" value="${itemsArray[index][3]}" name="beerQuantity" onchange="quantityChanged(this)" />
                            </div>
                            <div class="col s2 pt-1">
                                <a class="remove-cart-item"><i class="orange-text material-icons">close</i></a>
                            </div>
                        </div>
                    </li>
                    <li><div class="divider"></div></li>
            `
        }

        if(cartItem) {
            cartContainer.innerHTML = cartItem
            document.getElementById('clearCart').parentElement.parentElement.parentElement.className = 'show'
        } else {
            cartContainer.innerHTML = 'Your cart is empty!'
            document.getElementById('clearCart').parentElement.parentElement.parentElement.className = 'hide'
        }

        document.querySelectorAll('.remove-cart-item').forEach(removeBtn => {
            removeBtn.addEventListener('click', removeFromCart)
        })

        displayReceiptItems(itemsArray)
    }  
    
    document.getElementById('clearCart').addEventListener('click', emptyCart)

    function emptyCart() {
        localStorage.removeItem('cartItems')
        updateCartTotal()
        Cart.displayCartItems()
    }

    function removeFromCart(clickedBeer) {
        let targetBeer = clickedBeer.target.parentElement.parentElement.parentElement
        let targetName = targetBeer.children[0].children[0].innerText
        M.toast({html: 'Beer removed from cart!'})
        Cart.removeCartItem(targetName)
    }

    class  Cart {
        static getCartItems() {
            let cartItems = localStorage.getItem('cartItems')
            if(cartItems === null) {
                cartItems = []
            } 
            else {
                cartItems = JSON.parse(localStorage.getItem('cartItems'))
            }
            updateCartInfo(cartItems)
            return cartItems
        }

        static removeCartItem(item) {
            let cartItems = Cart.getCartItems()
            
            for(let index in cartItems) {
                if(cartItems[index][1] === item) {
                    cartItems.splice(index, 1)
                }
            }

            localStorage.setItem('cartItems', JSON.stringify(cartItems))
            updateCartTotal()
            Cart.displayCartItems()
        }

        static displayCartItems() {
            let cartItems = Cart.getCartItems()
            displayCartItems(cartItems)
            updateCartTotal()
        }

        static addCartItems(beerInfo) {
            let cartItems = Cart.getCartItems()
            cartItems.push(beerInfo)
            localStorage.setItem('cartItems', JSON.stringify(cartItems))
        }
    }

    function updateCartInfo(items) {
        document.getElementById('cart-info').innerText = items.length
    }

    document.addEventListener('DOMContentLoaded', Cart.displayCartItems)
// END OF SHOPPING CART

// CREATING RECEIPT 
    function displayReceiptItems(items) {
        const totalReceipt = document.getElementById('totalReceipt')
        const receiptItemsContainer = document.getElementById('receipt-items')
        let totalReceiptSum = 0
        let receiptItem = ''

        for(let indeks in items) {
            totalReceiptSum += items[indeks][2] * items[indeks][3]
            receiptItem += `
                <tr>
                    <td>${Number(indeks) + 1}</td>
                    <td>${items[indeks][1]}</td>
                    <td>${items[indeks][3]}</td>
                    <td>${items[indeks][2]}</td>
                    <td>${(items[indeks][2] * items[indeks][3]).toFixed(2)}</td>
                </tr>
            `
        }
        receiptItemsContainer.innerHTML = receiptItem
        totalReceipt.textContent = totalReceiptSum.toFixed(2)
    }
// END OF CREATING RECEIPT

// VALIDATION METHODS FOR /ABOUT.HTML AND DELIVERY FORM (GLOBALS)
    // DELIVERY FORM VALIDATION
        const nameExpression = /^[A-ZČĆŽĐŠ][a-zćčžđš]{1,14}\s([A-ZČĆŽĐŠ][a-zćčžđš]{1,14})?\s?[A-ZČĆŽŠĐ][a-zćčžđš]{1,19}$/
        const streetAddressExpression = /^[A-Za-zČĆŽĐŠčćžđš'\.\-\s\,0-9]{3,}$/
        const postalCodeExpression = /^[0-9]{5}$/
        const contactPhoneExpression = /^\+?[0-9]{11,12}$/

        const deliveryName = document.getElementById('customerName')
        const deliveryAddress = document.getElementById('address')
        const deliveryPostalCode = document.getElementById('postalCode')
        const deliveryPhone = document.getElementById('phoneNumber')
        const deliveryButton = document.getElementById('deliveryBtn')
        const deliveryForm = document.getElementById('deliveryForm')

        deliveryForm.addEventListener('submit', (event) => {
            if(checkBtn(deliveryBtn, 'deliveryBtn')) {
                event.preventDefault()
                alert(`Thank you ${deliveryName.value} for ordering our beers! Our couriers will contact you on ${deliveryPhone.value}, when they arrive at ${deliveryAddress.value}. Best regards!`)
                clearDeliveryFields()
                emptyCart()
            } else {
                event.preventDefault()
                alert('Looks like you forgot something to fill. Check your fields!') 
                checkField(deliveryName, nameExpression)
                checkField(deliveryAddress, streetAddressExpression)
                checkField(deliveryPostalCode, postalCodeExpression)
                checkField(deliveryPhone, contactPhoneExpression)
            }
        })

        function deliveryBtn() {
            if(checkField(deliveryName, nameExpression) && checkField(deliveryAddress, streetAddressExpression) && checkField(deliveryPostalCode, postalCodeExpression) && checkField(deliveryPhone, contactPhoneExpression)) return 1
            return 0
        }

        function clearDeliveryFields() {
            fieldNeutral(deliveryName)
            fieldNeutral(deliveryAddress)
            fieldNeutral(deliveryPostalCode)
            fieldNeutral(deliveryPhone)
            deliveryButton.className = 'btn btn-large red center waves-effect waves-light'
        }

        addListenerForField(deliveryName, nameExpression, 'keyup')
        addListenerForField(deliveryName, nameExpression, 'blur')
        addListenerForButton(deliveryName, deliveryBtn, 'deliveryBtn', 'keyup')

        addListenerForField(deliveryAddress, streetAddressExpression, 'keyup')
        addListenerForField(deliveryAddress, streetAddressExpression, 'blur')
        addListenerForButton(deliveryAddress, deliveryBtn, 'deliveryBtn', 'keyup')

        addListenerForField(deliveryPostalCode, postalCodeExpression, 'keyup')
        addListenerForField(deliveryPostalCode, postalCodeExpression, 'blur')
        addListenerForButton(deliveryPostalCode, deliveryBtn, 'deliveryBtn', 'keyup')

        addListenerForField(deliveryPhone, contactPhoneExpression, 'keyup')
        addListenerForField(deliveryPhone, contactPhoneExpression, 'blur')
        addListenerForButton(deliveryPhone, deliveryBtn, 'deliveryBtn', 'keyup')
    // END OF DELIVERY FORM VALIDATION 

    // FUNCTIONS FOR ALL FORM VALIDATIONS
        function fieldNeutral(field) {
            field.className = 'white-text'
            field.value = ''
            field.nextElementSibling.nextElementSibling.className = ''
            field.nextElementSibling.nextElementSibling.innerHTML = ''
        } 

        function fieldValid(field) {
            if(field.classList.contains('fail')) {
                field.classList.remove('fail')
                field.classList.add('pass')
                field.nextElementSibling.nextElementSibling.classList.remove('red-text')
                field.nextElementSibling.nextElementSibling.classList.add('teal-text')
            } else {
                field.classList.add('pass')
            }
            field.nextElementSibling.nextElementSibling.innerHTML = `&check;`
            field.nextElementSibling.nextElementSibling.classList.add('teal-text')
        }

        function fieldInvalid(field, text) {
            if(field.classList.contains('pass')) {
                field.classList.remove('pass')
                field.classList.add('fail')
                field.nextElementSibling.nextElementSibling.classList.remove('teal-text')
                field.nextElementSibling.nextElementSibling.classList.add('red-text')    
            } else {
                field.classList.add('fail')
            }
            field.nextElementSibling.nextElementSibling.innerText = `${text}`
            field.nextElementSibling.nextElementSibling.classList.add('red-text')
        }

        function checkField(field, expression) {
            let fieldValue = field.value 
            return checkRegEx(expression, fieldValue, field) 
        }

        function checkRegEx(expression, fieldValue, field) {
            if(expression.test(String(fieldValue))) {
                fieldValid(field)
                return 1 // Is valid, return 1
            } else {
                fieldInvalid(field, `${field.name} is not as expected!`)
                return 0 // It isn't as expected, return 0
            } 
        }

        function checkBtn(callback, buttonId) {
            let button = document.getElementById(buttonId)
            if(callback()) {
                if(button.classList.contains('red')) {
                    button.classList.remove('red')
                    button.classList.add('teal')
                } else {
                    button.classList.add('teal')
                }
                return 1 // Button is valid, and can submit the form
            } else {
                if(button.classList.contains('teal')) {
                    button.classList.remove('teal')
                    button.classList.add('red')
                } else {
                    button.classList.add('red')
                }
                return 0 // Button is not allowed to submit if any field isn't filled
            }
        }

        function addListenerForField(field, expression, event) {
            field.addEventListener(event, () => {
                checkField(field, expression)
            })
        }

        function addListenerForButton(field, callback, buttonId, event) {
            field.addEventListener(event, () => {
                checkBtn(callback, buttonId)
            })
        }
    // END OF FUNCTIONS FOR ALL FORM VALIDATIONS
// END OF VALIDATION METHODS FOR /ABOUT.HTML AND DELIVERY FORM (GLOBALS)


// CONTACT VALIDATION FOR /ABOUT.HTML
    function contactValidation() {
        const nameExpression = /^[A-ZČĆŽĐŠ][a-zćčžđš]{1,14}\s([A-ZČĆŽĐŠ][a-zćčžđš]{1,14})?\s?[A-ZČĆŽŠĐ][a-zćčžđš]{1,19}$/
        const mailExpression = /^[a-zA-Z0-9]([a-z]|[0-9])+\.?-?_?([a-z]|[0-9])*\.?([a-z]|[0-9])*\@[a-z]{3,}\.([a-z]{2,4}\.)?([a-z]{2,4})$/
        
        const nameField = document.getElementById('fullname')
        const mailField = document.getElementById('email')
        const textField = document.getElementById('textarea2')
        const ageButton = document.querySelectorAll('input[type="radio"]')
        const submitBtn = document.getElementById('contactSubmit')


        document.getElementById('contactForm').addEventListener('submit', (event) => {
            if(checkBtn(contactButton, 'contactSubmit')) {
                event.preventDefault()
                alert(`Thank you ${nameField.value} for contacting us! We will answer you shortly on ${mailField.value}. Best regards!`)
                clearInputs()   
            }
            else {
                event.preventDefault()
                alert('You must be at least 18 years old! Check your inputs!') 
                checkField(nameField, nameExpression)
                checkField(mailField, mailExpression)
                textAreaCheck()
            }
        })

        addListenerForField(nameField, nameExpression, 'keyup')
        addListenerForField(nameField, nameExpression, 'blur')
        addListenerForButton(nameField, contactButton, 'contactSubmit', 'keyup')

        addListenerForField(mailField, mailExpression, 'keyup')
        addListenerForField(mailField, mailExpression, 'blur')
        addListenerForButton(mailField, contactButton, 'contactSubmit', 'keyup')

        textField.addEventListener('keyup', textAreaCheck)
        textField.addEventListener('blur', textAreaCheck)
        textField.addEventListener('keyup', () => {
            checkBtn(contactButton, 'contactSubmit')
        })

        ageButton.forEach(button => {
            button.addEventListener('change', checkAge)
        })

        ageButton.forEach(button => {
            button.addEventListener('change', () => {
                checkBtn(contactButton, 'contactSubmit')
            })
        })
    

        function clearInputs() {
            fieldNeutral(nameField)
            fieldNeutral(mailField)
            areaNeutral()
            submitBtn.className = 'btn btn-large red waves-effect waves-light'
            document.querySelector('input[type="radio"]:checked').checked = false
            document.querySelector('#noteight').checked = true
        }

        function contactButton() {
            if(textAreaCheck() && checkField(nameField, nameExpression) && checkField(mailField, mailExpression) && checkAge()) return 1
            return 0
        }

        function checkAge() {
            let selectedAge = Number(document.querySelector('input[name="age"]:checked').value)
                if(selectedAge) return 1
                return 0        
        }

        function areaNeutral() {
            textField.className = 'textarea fieldInput'
            textField.value = ''
            textField.nextElementSibling.nextElementSibling.className = ''
            textField.nextElementSibling.nextElementSibling.innerHTML = ''
        }

        function textAreaCheck() {
            if((textField.value.length > 0) && (textField.value.length < 500)) {
                fieldValid(textField)
                return 1
            } else {
                fieldInvalid(textField, 'Message must be between 0-500 characters!')
                return 0
            }
        }
    }
// END OF CONTACT VALIDATION FOR /ABOUT.HTML

// FETCH AND CREATE NAVIGATION LINKS
    function loadNavigation() {    
        const visibleList = document.getElementById('visible-links')
        const collapsedList = document.getElementsByClassName('sideNavCollapsed')[0]
        
        let pagePath = window.location.pathname
    
        fetchData('navigation').then(data => {
            for(let link of data) {
                let listItem = document.createElement('li')
                let linkName = document.createTextNode(link.value)
                let listLink = document.createElement('a')
                    listLink.href = `${link.location}`
                    listLink.append(linkName)
                    pagePath === link.location ? listItem.className = 'active' : listItem.className = ''
                    listItem.append(listLink)
                    collapsedList.append(listItem)
            }
            for(let link of data) {
                let listItem = document.createElement('li')
                let linkName = document.createTextNode(link.value)
                let listLink = document.createElement('a')
                    listLink.href = `${link.location}`
                    listLink.append(linkName)
                    pagePath === link.location ? listItem.className = 'active' : listItem.className = ''
                    listItem.append(listLink)
                    visibleList.append(listItem)
            }
        })

    }    
// END OF FETCH AND CREATE NAVIGATION LINKS

// LOADING SCREEN FADEOUT 
    function pageLoad() {
        $(document).ready(() => {
            $('#intro').hide()
            setTimeout(() => {
                $('.loader').animate({
                    opacity: 0
                }, 1000)
            }, 2000)
            setTimeout(() => {
                $('.loader').remove()
            }, 3000)
            setTimeout(() => {
                $('#intro').fadeIn(1000)
            },3000)
        })
    }

    pageLoad()
// END OF LOADING SCREEN FADEOUT

// SCROLL TO TOP BUTTON
    function scrollToTopBtn() {
        const backToTopButton = document.getElementById('toTopBtn')
        const scrollBack = () => window.scrollTo(0, 0)
        
        backToTopButton.addEventListener('click', scrollBack)
        
        const showBtn = () => {
            if(window.pageYOffset > 300) {
                if(backToTopButton.classList.contains('scale-out')) {
                    backToTopButton.classList.remove('scale-out')
                    backToTopButton.classList.add('scale-in')
                }
            } else {
                if(backToTopButton.classList.contains('scale-in')) {
                    backToTopButton.classList.remove('scale-in')
                    backToTopButton.classList.add('scale-out')    
                }
            }
        }
        window.addEventListener('scroll', showBtn)
    }
// END OF SCROLL TO TOP BUTTON

// MATERIALIZE & JQUERY COMPONENTS
    $(document).ready(() => {
        loadNavigation()
        scrollToTopBtn()
        AOS.init()
        $('.modal').modal()
        $('.sidenav').sidenav()
        $('.sidenav2').sidenav({
            edge: 'right'
        })
        $('.parallax').parallax()
        $('select').formSelect()
    })
// END OF MATERIALIZE & JQUERY COMPONENTS