let pageLink = window.location.pathname

if(pageLink == '/worldCraft/shop.html'){
    fetchData('beers').then(beer => {
        localStorage.setItem('beers', JSON.stringify(beer))
    })
    
    fetchData('breweries').then(brewery => {
        localStorage.setItem('breweries', JSON.stringify(brewery))
    })
    
    fetchData('types').then(type => {
        localStorage.setItem('types', JSON.stringify(type))
    })
    
    fetchData('alc-percentage').then(percentage => {
        localStorage.setItem('alc-percentages', JSON.stringify(percentage))
    })
    
    let beers = JSON.parse(localStorage.getItem('beers'))
    let breweries = JSON.parse(localStorage.getItem('breweries'))
    let types = JSON.parse(localStorage.getItem('types'))
    let percentages = JSON.parse(localStorage.getItem('alc-percentages'))
    
    loadBeers(beers)
    loadFilters(breweries, 'brandFilter', 'beerBrand')
    loadFilters(types, 'typeFilter', 'beerType')
    loadFilters(percentages, 'alcFilter', 'beerAlcohol')
    
    function filterByBrewery() {
        let choosenBreweryIds = []
        let choosenBreweries = document.querySelectorAll('input[name="beerBrand"]:checked')
        
        choosenBreweries.forEach(brewery => {
            choosenBreweryIds.push(Number(brewery.value))
        })
    
        let filteredBeers = beers.filter(beer => {
            for(let choosenId of choosenBreweryIds) {
                if(beer.brewery === choosenId) return true
            }
        })    
    
        if(filteredBeers.length) loadBeers(filteredBeers)
        else loadBeers(beers)
    }
    
    function filterByType() {
        let choosenTypeIds = []
        let choosenTypes = document.querySelectorAll('input[name="beerType"]:checked')
        
        choosenTypes.forEach(type => {
            choosenTypeIds.push(Number(type.value))
        })
    
        let filteredBeers = beers.filter(beer => {
            for(let choosenId of choosenTypeIds) {
                for(let beerType of beer.types) {
                    if(beerType === choosenId) return true
                }
            }
        })    
    
        if(filteredBeers.length) loadBeers(filteredBeers)
        else loadBeers(beers)
    }
    
    function filterByPercentage() {
        let choosenPercentageIds = []
        let choosenPercentages = document.querySelectorAll('input[name="beerAlcohol"]:checked')
        
        choosenPercentages.forEach(percentage => {
            choosenPercentageIds.push(Number(percentage.value))
        })
    
        let filteredBeers = beers.filter(beer => {
            for(let choosenRange of choosenPercentageIds) {
                if(beer.alcoholPercentage.percentageRange === choosenRange) return true
            }
        })    
    
        if(filteredBeers.length) loadBeers(filteredBeers)
        else loadBeers(beers)
    }
    
    document.querySelectorAll('input[name="beerBrand"]').forEach(box => {
        box.addEventListener('change', filterByBrewery)
    })
    
    document.querySelectorAll('input[name="beerType"]').forEach(box => {
        box.addEventListener('change', filterByType)
    })
    
    document.querySelectorAll('input[name="beerAlcohol"]').forEach(box => {
        box.addEventListener('change', filterByPercentage)
    })
    
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
    }
    
    function loadBeers(beerArray) {
        const beerContainer = document.getElementById('beerContainer')
        let beerCard = ''
        
        for(let beer of beerArray) {
            beerCard += `
                <div class="col s12 m6 l3">
                    <div class="card">
                        <div class="card-image">
                            <img class="product-image" src="./assets/img/beers/${beer.beerCover.location}" alt="${beer.beerCover.alternative}">
                            <a href="#!" class="halfway-fab btn-floating orange"><i class="material-icons">favorite</i></a>
                        </div>
                        <div class="card-content">
                            <span class="card-title activator grey-text text-darken-4">${beer.beerName}<i class="material-icons right">more_vert</i></span>
                            <p class="small-text pt-1">Brand: ${showBrand(beer.brewery)}</p>
                            <p class="small-text pt-1">Type: ${showTypes(beer.types)}</p>
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
        beerContainer.innerHTML = beerCard
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
        loadBeers(beers)
    }
    
    document.getElementById('clearFilters').addEventListener('click', () => {
        if(!this.disabled) clearAllFilters()
    })
    
    document.querySelectorAll('input').forEach(checkbox => {
        const clearBtn = document.getElementById('clearFilters')
        addEventListener('change', () => {
            if(clearBtn.disabled) clearBtn.disabled = false 
        })
    })
    
    // // END OF FILTER CLEAR
    
}

pageLoad()
scrollToTopBtn()
loadNavigation()
// LOAD ALL JSONS IN LOCAL STORAGE

async function fetchData(fileName) {
    try {
        res = await fetch(`./assets/data/${fileName}.json`)
        return res.json()
    } catch (error) {
        console.log(error)
    }
}


// FETCH AND CREATE NAVIGATION LINKS
    function loadNavigation() {    
        const visibleList = document.getElementById('visible-links')
        const collapsedList = document.getElementsByClassName('sideNavCollapsed')[0]
        
        let pagePath = window.location.pathname
    
        fetchData('navigation').then(items => {
            for(let item of items) {
                let listItem = document.createElement('li')
                let linkName = document.createTextNode(item.value)
                let listLink = document.createElement('a')
                    listLink.href = `${item.location}`
                    listLink.append(linkName)
                    pagePath === item.location ? listItem.className = 'active' : listItem.className = ''
                    listItem.append(listLink)
                    collapsedList.append(listItem)
            }
            for(let item of items) {
                let listItem = document.createElement('li')
                let linkName = document.createTextNode(item.value)
                let listLink = document.createElement('a')
                    listLink.href = `${item.location}`
                    listLink.append(linkName)
                    pagePath === item.location ? listItem.className = 'active' : listItem.className = ''
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
