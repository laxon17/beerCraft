scrollToTopBtn()

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

