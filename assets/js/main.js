async function fetchData(fileName) {
    try {
        res = await fetch(`./assets/data/${fileName}.json`)
        return res.json()
    } catch(err) {
        console.error(err)
    }
}

function loadTypeFilters() {
    const typesList = document.getElementById('typeFilter')

    let typeItems = ''
    fetchData('types').then(types => {
        for(let type of types) {
            typeItems += `
                <li>
                    <label>
                        <input type="checkbox" name="beerType" value="${type.id}" />
                        <span>${type.name}</span>
                    </label>
                </li>
            `
        }
        typesList.innerHTML = typeItems
    })
}

function loadBrandFilters() {
    const brandList = document.getElementById('brandFilter')

    let brandsItems = ''
    fetchData('breweries').then(brands => {
        for(let brand of brands) {
            brandsItems += `
                <li>
                    <label>
                        <input type="checkbox" name="beerBrand" value="${brand.id}" />
                        <span>${brand.name}</span>
                    </label>
                </li>
            `
        }
        brandList.innerHTML = brandsItems
    })
}

function loadAlchoholFilters() {
    const percentageList = document.getElementById('alcFilter')

    let percentageItems = ''
    fetchData('alc-percentage').then(percentages => {
        for(let percentage of percentages) {
            percentageItems += `
                <li>
                    <label>
                        <input type="checkbox" name="beerBrand" value="${percentage.id}" />
                        <span>${percentage.title}</span>
                    </label>
                </li>
            `
        }
        percentageList.innerHTML = percentageItems
    })
}

function loadBeers() {
    const beerContainer = document.getElementById('beerContainer')

    let beerCard = ''

    fetchData('beers').then((beers) => {
        for(let beer of beers) {
            beerCard += `
                <div class="col s12 m6 l3">
                    <div class="card">
                        <div class="card-image">
                            <img class="product-image" src="./assets/img/beers/${beer.beerCover.location}" alt="${beer.beerCover.alternative}">
                            <a href="#!" class="halfway-fab btn-floating orange"><i class="material-icons">favorite</i></a>
                        </div>
                        <div class="card-content">
                            <span class="card-title activator grey-text text-darken-4">${beer.beerName}<i class="material-icons right">more_vert</i></span>
                            <p class="small-text pt-1">${loadTypes(beer.types)}</p>
                            <p class="small-text pt-1">Alc. % ${beer.alcoholPercentage.percentage}</p>
                            <p id="beer-price" class="pt-2 center">&euro; ${beer.price}</p>
                        </div>
                        <div class="center card-action">
                            <a href="#!">Add To Cart</a>
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
    })  
}

function loadTypes(typeIds) {
    let output = ''
    fetchData('types').then(types => {
            for(let type of types) {
                for(let typeId in typeIds) {
                    if(typeIds[typeId] === type.id) {
                        if(typeId < typeIds.length - 1) {
                            output += `${type.name}, `
                        } else output += `${type.name}`
                    }
                }
            }
            return "OPOOOO"
    }).catch(err => {
        console.log(err)
    })
}


loadBeers()
scrollToTopBtn()
loadNavigation()
loadTypeFilters()
loadBrandFilters()
loadAlchoholFilters()


function loadNavigation() {    
    const visibleList = document.getElementById('visible-links')
    const collapsedList = document.getElementsByClassName('sideNavCollapsed')[0]
    
    fetchData('navigation').then(items => {
        for(let item of items) {
            let listItem = document.createElement('li')
            let linkName = document.createTextNode(item.value)
            let listLink = document.createElement('a')
                listLink.href = item.location
                listLink.append(linkName)
                listItem.append(listLink)
                collapsedList.append(listItem)
        }

        for(let item of items) {
            let listItem = document.createElement('li')
            let linkName = document.createTextNode(item.value)
            let listLink = document.createElement('a')
                listLink.href = item.location
                listLink.append(linkName)
                listItem.append(listLink)
                visibleList.append(listItem)
        }
    })
}

function scrollToTopBtn() {
    // BACK TO TOP BUTTON
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
    // END OF BACK TO TOP BUTTON
}

// $(window).on('load', () => {
//     $('#intro').hide()
//     setTimeout(() => {
//         $('.loader').animate({
//             opacity: 0
//         }, 1000)
//     }, 2000)
//     setTimeout(() => {
//         $('.loader').remove()
//     }, 3000)
//     setTimeout(() => {
//         $('#intro').fadeIn(1000)
//     },3000)
// })

function clearAllFilters() {
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false
    })
    document.querySelector('input').value = ''
    document.getElementById('clearFilters').disabled = true
}

document.getElementById('clearFilters').addEventListener('click', () => {
    if(this.disabled) {}
    else clearAllFilters()
})

document.querySelectorAll('input').forEach(checkbox => {
    const clearBtn = document.getElementById('clearFilters')
    addEventListener('change', () => {
        if(clearBtn.disabled) clearBtn.disabled = false 
    })
})