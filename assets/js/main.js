

async function getData(location) {
    try {
        res = await fetch(location)
        return await res.json()
    } catch(err) {
        console.error(err)
    }
}

function createNavigation() {
    const visibleList = document.getElementById('visible-links')
    const collapsedList = document.getElementsByClassName('sideNavCollapsed')[0]
    getData('./assets/data/navigation.json').then((items) => {
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
    }).catch((error) => console.error(error))
}

createNavigation()

scrollToTopBtn()

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

function loadBeers() {
    const beerContainer = document.getElementById('beerContainer')

    let beerCard = ''

    getData('./assets/data/beers.json').then((beers) => {
        for(let beer of beers) {
            beerCard += `
                <div class="col s12 m6 l3">
                    <div class="card">
                        <div class="card-image">
                            <img class="product-image" src="./assets/img/beers/${beer.beerCover.location}" alt="${beer.beerCover.alternative}">
                            <a href="#!" class="halfway-fab btn-floating orange"><i class="material-icons">favorite</i></a>
                        </div>
                        <div class="card-content">
                            <div class="card-title">${beer.beerName}</div>
                            <p class="small-text pt-1">IpA</p>
                            <p class="small-text pt-1">Alc. % ${beer.alcoholPercentage.percentage}</p>
                            <p id="beer-price" class="pt-2 center">&euro; ${beer.price}</p>
                        </div>
                        <div class="center card-action">
                            <a href="#!">Add To Cart</a>
                        </div>
                    </div>
                </div> 
            `
        }
        beerContainer.innerHTML = beerCard
    })  
}

loadBeers()
