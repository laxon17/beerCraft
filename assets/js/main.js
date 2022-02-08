let pageLink = window.location.pathname
const links = fetchLocalStorage('navigation')
loadNavigation(links)

if(pageLink == '/worldCraft/shop.html'){

    
    
    const beers = fetchLocalStorage('beers')
    const breweries = fetchLocalStorage('breweries')
    const types = fetchLocalStorage('types')
    const percentages = fetchLocalStorage('alc-percentage')
    
    
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
                            <a id="addToCart" href="#!">Add To Cart</a>
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
    
    Array.from(document.getElementsByClassName('add-to-favorites')).forEach(btn => {
        btn.addEventListener('click', addToFavorites)
    })

    function addToFavorites(clickedBeer) {
        let favorites
        let targetBeer = clickedBeer.target.parentElement.parentElement.parentElement
        let beerInfo = []
        let beerName = targetBeer.children[1].children[0].innerHTML
        let theName = beerName.substring(0, beerName.indexOf('<'))
        let imgSource = targetBeer.firstElementChild.firstElementChild.getAttribute('src')

        beerInfo.push(imgSource, theName)

        Favorites.addFavorite(beerInfo)
        
    }

    class Favorites {
        static getFavorite() {
            let favorites
            if(localStorage.getItem('favorites') === null) favorites = [] 
            else favorites = JSON.parse(localStorage.getItem('favorites'))
            return favorites
        }
        static addFavorite(beerInfo) {
            let favorites = Favorites.getFavorite()
            favorites.push(beerInfo)
            localStorage.setItem('favorites', JSON.stringify(favorites))
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


scrollToTopBtn()

// LOAD ALL JSONS IN LOCAL STORAGE

async function fetchData(fileName) {
    try {
        res = await fetch(`./assets/data/${fileName}.json`)
        return res.json()
    } catch (error) {
        console.log(error)
    }
}

function fetchLocalStorage(file) {
    fetchData(file).then(instance => {
        localStorage.setItem(file, JSON.stringify(instance))
    })
    return JSON.parse(localStorage.getItem(file))
}

// FETCH AND CREATE NAVIGATION LINKS
    function loadNavigation(data) {    
        const visibleList = document.getElementById('visible-links')
        const collapsedList = document.getElementsByClassName('sideNavCollapsed')[0]
        
        let pagePath = window.location.pathname
    
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

// Materialize components initialization 
    $(document).ready(function(){
        AOS.init()
        $('.sidenav').sidenav()
        $('.sidenav2').sidenav({
            edge: 'right'
        })
        $('.parallax').parallax()
        $('select').formSelect()
    })
// End of Materialize components initialization 
