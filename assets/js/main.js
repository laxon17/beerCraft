$(window).on('load', () => {
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

async function fetchData(fileName) {
    try {
        res = await fetch(`./assets/data/${fileName}.json`)
        return res.json()
    } catch (error) {
        console.log(error)
    }
}

function loadFilters(dataFile, filterContainer, filterName) {
    const filterList = document.getElementById(filterContainer)
    let filterItems = ''

    fetchData(dataFile).then(items => {
        for(let item of items) {
            filterItems += `
                <li>
                    <label>
                        <input type="checkbox" name="${filterName}" value="${item.id}" />
                        <span>${item.title}</span>
                    </label>
                </li>
            `
        }
        filterList.innerHTML = filterItems
    })
}



function loadBeers() {
    const beerContainer = document.getElementById('beerContainer')
    let beerCard = ''
    
    fetchData('beers').then((beers) => {
        for(let beer of beers) {
            const typesDisplay = 'generate types display'
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
    })  
}

function loadTypes(typeIds) {
    let types = fetchData('types')
    let output = ''


    return output
}


loadBeers()
scrollToTopBtn()
loadNavigation()
loadFilters('breweries', 'brandFilter', 'beerBrand')
loadFilters('types', 'typeFilter', 'beerType')
loadFilters('alc-percentage', 'alcFilter', 'beerAlcohol')


function loadNavigation() {    
    const visibleList = document.getElementById('visible-links')
    const collapsedList = document.getElementsByClassName('sideNavCollapsed')[0]
    
    let pagePath = window.location.pathname
    let pagePathTrimmed = pagePath.substring(pahePath.indexOf('/', 2), pagePath.indexOf('.'))

    fetchData('navigation').then(items => {
        for(let item of items) {
            let listItem = document.createElement('li')
            let linkName = document.createTextNode(item.value)
            let listLink = document.createElement('a')
                listLink.href = `${item.location}.html`
                listLink.append(linkName)
                pagePathTrimmed === item.location ? listItem.className = 'active' : listItem.className = ''
                listItem.append(listLink)
                collapsedList.append(listItem)
        }
        for(let item of items) {
            let listItem = document.createElement('li')
            let linkName = document.createTextNode(item.value)
            let listLink = document.createElement('a')
                listLink.href = `${item.location}.html`
                listLink.append(linkName)
                pagePathTrimmed === item.location ? listItem.className = 'active' : listItem.className = ''
                listItem.append(listLink)
                visibleList.append(listItem)
        }
    })
}

// LISTEN IF A FILTER IS SELECTED, AND ENABLE FILTER CLEAR BTN

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

// END OF FILTER CLEAR

// INTRO LOADING SCREEN FADEOUT AND REMOVING



// END OF INTRO LOADING SCREEN FADEOUT AND REMOVING

// BACK TO TOP BUTTON

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

// END OF BACK TO TOP BUTTON