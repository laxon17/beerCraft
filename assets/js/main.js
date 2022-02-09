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

// SHOP PAGE
    if(window.location.pathname === '/shop.html') shopPage()

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
        
        // // LISTEN IF A FILTER IS SELECTED, AND ENABLE FILTER CLEAR BTN
        
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
        
        document.querySelectorAll('input').forEach(element => {
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
        
        favoritesContainer.innerHTML = (favoriteBeer) ? favoriteBeer + addRemoveAll(favoriteBeer) : 'No favorites added yet!'
        
        document.querySelectorAll('.remove-favorite').forEach(removeBtn => {
            removeBtn.addEventListener('click', removeFromFavorites)
        })
        document.getElementById('removeAllFavorites').addEventListener('click', removeAllFavorites)
    }  

    function removeAllFavorites() {
        localStorage.removeItem('favorites')
        Favorites.displayFavorites()
    }

    function addRemoveAll(string) {
        if(string) return `
            <li>
                <a class="btn btn-medium orange" id="removeAllFavorites">Remove all</a>
            </li>
        `
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

    document.addEventListener('DOMContentLoaded', Favorites.displayFavorites)
// END OF FAVORITES

// SHOPPING CART
    function updateCartTotal() {
        const totalContainer = document.getElementById('cartTotal')
        const beerQuantity = document.getElementsByName('beerQuantity')
        let cartItems = Cart.getCartItems()
        let cartTotal = 0

        cartItems.forEach((item, index) => {
            cartTotal += item[2] * beerQuantity[index].value
        })

        cartTotal = Math.round(cartTotal * 100) / 100

        totalContainer.innerHTML = cartTotal ? ` - &euro;${cartTotal}` : ``
    }

    function quantityChanged(event) {
        let quantityInput = event.target
        if(isNaN(quantityInput.value) || quantityInput.value <= 0) {
            quantityInput.value = 1
        }
        updateCartTotal()
    }
    
    function addToCart(clickedBeer) {
        let targetBeer = clickedBeer.target.parentElement.parentElement
        let beerInfo = []
        let beerNameHolder = targetBeer.children[1].children[0].innerHTML
        let theName = beerNameHolder.substring(0, beerNameHolder.indexOf('<'))
        let imgSource = targetBeer.children[0].children[0].getAttribute('src')
        let beerPriceHolder = targetBeer.children[1].children[4].textContent
        let beerPrice = Number(beerPriceHolder.substring(2, beerPriceHolder.length)) 

        if(!checkItemRepeat(theName)) {
            M.toast({html: 'Beer is already in cart!'})
        } else {
            M.toast({html: 'Beer added to cart!'})
            beerInfo.push(imgSource, theName, beerPrice)
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
                            <div class="col s4">
                                <div data-input="quantity">
                                    <input type="number" name="beerQuantity" value="1" />
                                </div>
                            </div>
                            <div class="col s2 pt-1">
                                <a class="remove-cart-item"><i class="orange-text material-icons">close</i></a>
                            </div>
                        </div>
                    </li>
                    <li><div class="divider"></div></li>
            `
        }
        
        cartContainer.innerHTML = (cartItem) ? cartItem + addRemoveCheck(cartItem) : 'Your cart is empty!'

        document.getElementById('clearCart').addEventListener('click', emptyCart)
        document.querySelectorAll('.remove-cart-item').forEach(removeBtn => {
            removeBtn.addEventListener('click', removeFromCart)
        })
        document.querySelectorAll('input[name="beerQuantity"]').forEach(quantity => {
            quantity.addEventListener('change', quantityChanged)
        })
    }  

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

    function addRemoveCheck(string) {
        if(string) return `
            <li>
                <div class="row">
                    <div class="col s6">
                        <a class="btn btn-medium orange" id="checkout">Checkout</a>
                    </div>
                    <div class="col s6">
                        <a class="btn btn-medium orange" id="clearCart">Clear cart</a>
                    </div>
                </div>
            </li>
        `
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

    document.addEventListener('DOMContentLoaded', Cart.displayCartItems)
// END OF SHOPPING CART

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
        $('.sidenav').sidenav()
        $('.sidenav2').sidenav({
            edge: 'right'
        })
        $('.parallax').parallax()
        $('select').formSelect()
    })
// END OF MATERIALIZE & JQUERY COMPONENTS