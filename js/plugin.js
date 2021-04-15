/* ********************************************************
********************** Select Element *********************
**********************************************************/
const apiKey = "1dba575db6b3c4b61cea77ef1f176bb2";



/* ********************************************************
*********************** Loading Page **********************
**********************************************************/
$(window).on("load", function () {
    $('#loading-wrapper').delay("1000").fadeOut();
});
/* xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
xxxxxxxxxxxxxxxxxxxx Function Is End  xxxxxxxxxxxxxxxxxxxxx
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx */



/* ********************************************************
************* Set Dynamic Image For Front Page ************
**********************************************************/
let categoryImages = $(".category-img");

$(categoryImages).each(function (i, item) {
    let movieType = $(item).data("type");

    getMoviePoster(movieType, function (data) {
        $(item).attr("src", `https://image.tmdb.org/t/p/original${data}`)
    })
})

function getMoviePoster(movieType, callback) {
    $.ajax({
        url: `https://api.themoviedb.org/3/movie/${movieType}?api_key=${apiKey}`,
        type: 'GET',
        success: function (data) {
            callback(data.results[4].poster_path)
        }
    })
}
/* xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
xxxxxxxxxxxxxxxxxxxx Function Is End  xxxxxxxxxxxxxxxxxxxxx
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx */



/* ********************************************************
*********** Add All Movies & Information In Page **********
**********************************************************/
let moviesType = localStorage.getItem("moviesType");;

function goToCategory(openCategory) {
    moviesType = $(openCategory).data("type")
    localStorage.setItem("moviesType", (moviesType));        // Set Movies Type In LocalStorage
    window.location.replace(moviesType + '.html');
}

function moviesInformation(moviesType, callback) {
    $.ajax({
        url: `https://api.themoviedb.org/3/movie/${moviesType}?api_key=${apiKey}`,
        type: 'GET',
        success: function (data) {
            callback(data)
        }
    })
}
/* xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
xxxxxxxxxxxxxxxxxxxx Function Is End  xxxxxxxxxxxxxxxxxxxxx
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx */



/* ********************************************************
********* Open The movie’s page & show Information*********
**********************************************************/
let getMovieId;
let moviesId = localStorage.getItem("moviesId");

function showInformation(getId) {
    getMovieId = $(getId).data("id");
    location = "movie.html"
    localStorage.setItem("moviesId", (getMovieId));
}

$.get(`https://api.themoviedb.org/3/movie/${moviesId}?api_key=${apiKey}`, function (data) {
    setMovieInformation(data)
})
/* xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
xxxxxxxxxxxxxxxxxxxx Function Is End  xxxxxxxxxxxxxxxxxxxxx
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx */



/* ********************************************************
******************** Add Movie’s Videos *******************
**********************************************************/
$.get(`https://api.themoviedb.org/3/movie/${moviesId}/videos?api_key=${apiKey}`, function (data) {
    if (data.results.length != 0) {
        for (let i = 0; i < data.results.length; i++) {
            addVideos(data.results[i].key)
        }
    } else {
        hideVideoSection()
    }
})
/* xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
xxxxxxxxxxxxxxxxxxxx Function Is End  xxxxxxxxxxxxxxxxxxxxx
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx */



/* ********************************************************
******************** Add Movie’s Photos *******************
**********************************************************/
$.get(`https://api.themoviedb.org/3/movie/${moviesId}/images?api_key=${apiKey}`, function (data) {
    for (let i = 0; i < data.backdrops.length; i++) {
        addImages(data.backdrops[i].file_path, data.backdrops[i].vote_count, i)
    }
    // Trigger LightGallery Plugin
    // triggerPlugin()
})
/* xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
xxxxxxxxxxxxxxxxxxxx Function Is End  xxxxxxxxxxxxxxxxxxxxx
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx */



function goBack() {
    window.history.back();
}
/* xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
xxxxxxxxxxxxxxxxxxxx Function Is End  xxxxxxxxxxxxxxxxxxxxx
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx */



moviesInformation(moviesType, function (data) {
    for (let i = 0; i < data.results.length; i++) {
        let showInformation = {
            count: data.results.length,
            poster: data.results[i].poster_path,
            title: data.results[i].title,
            language: data.results[i].original_language,
            overview: data.results[i].overview,
            date: data.results[i].release_date,
            vote: data.results[i].vote_average,
            id: data.results[i].id
        }
        showMovieInformation(data.results[1].poster_path, showInformation)
    }
})

function showMovieInformation(poster, objectInformation) {
    $("#moviesContainer").append(`
        <div class='movie'>
            <div class='poster-container'>
                <img onclick='showInformation(this)'
                src='https://image.tmdb.org/t/p/w500/${objectInformation.poster}' 
                class='poster' data-language='${objectInformation.language}' 
                data-overview='${objectInformation.overview}' 
                data-date='${objectInformation.date}' 
                data-vote='${objectInformation.vote}' 
                data-id='${objectInformation.id}' 
                alt='${objectInformation.title}'>
            </div>
            <div class='movie-title'><a>${objectInformation.title}</a></a></div>
            <div class='vote'>
                <div class='vote-contain'>
                    <img class='vote-img' src='images/star.png' alt='star'>
                    <p class='vote-average'>${objectInformation.vote}</p>
                </div>
            </div>
        </div>
    `)
    $("#allMovies").css("background-image", `url(https://image.tmdb.org/t/p/original${poster})`)
}

function setMovieInformation(information) {
    $(".poster-movie").attr("src", `https://image.tmdb.org/t/p/original${information.backdrop_path}`)
    $(".title-movie").text(information.title)
    $(".date-movie").text(information.release_date)
    $(".maturity-number").text(information.vote_average)
    $(".time-movie").text(information.runtime + " " + "m")
    $(".language-movie").text(information.spoken_languages[0].name)
    $(".overview-movie").text(information.overview)
    $(".main-url").attr("href", information.homepage)
    $(".imdb").attr("href", `https://www.imdb.com/title/${information.imdb_id}`)
    $(".span-tag").text(information.title)
    $(".span-tag-photo").text(information.title)
    showProductionCompanies(information)
    $('.companies:empty').parent().remove();
}

function showProductionCompanies(information) {
    for (let i = 0; i < information.production_companies.length; i++) {
        if (information.production_companies.filter((i) => i.logo_path).length != 0) {
            if (information.production_companies[i].logo_path != null) {
                addProductionCompaniesInformation(information.production_companies[i].logo_path , information.production_companies[i].name)
            }
        } else {
            hideCompaniesSection()
        }
    }
}


function addProductionCompaniesInformation(dataLogo, dataName) {
    $(".companies").append(`
        <div class="company">
            <div class="company-img">
                <img src="https://image.tmdb.org/t/p/original${dataLogo}" alt="${dataName}">
            </div>
            <h3 class="company-head">${dataName}</h3>
        </div>
    `)
}

function hideCompaniesSection() {
    $(".production-companies").hide()
}

function addVideos(trailer) {
    $(".videos-content").append(`
        <div class="video">
            <div class="plyr__video-embed player">
                <iframe
                    src="https://www.youtube.com/embed/${trailer}?origin=https://plyr.io&amp;iv_load_policy=3&amp;modestbranding=1&amp;playsinline=1&amp;showinfo=0&amp;rel=0&amp;enablejsapi=1" allowfullscreen allowtransparency allow="autoplay">
                </iframe>
            </div>
        </div>
    `)  
}

function hideVideoSection() {
    $(".videos").hide()
}

function addImages(images, vote, x) {
    // $("#lightgallery").append(`
    //     <a class="lg-class" href="https://image.tmdb.org/t/p/original${images}">
    //         <img src="https://image.tmdb.org/t/p/original${images}" />
    //     </a>
    // `)
    $(".carousel-indicators").append(`
        <li data-target="#carouselExampleIndicators" data-slide-to="${x}"></li>
    `)

    $('*[data-slide-to="0"]').addClass("active")

    $(".carousel-inner").append(`
        <div class="carousel-item" data-number="${x}">
            <img src="https://image.tmdb.org/t/p/original${images}" class="d-block w-100" alt="${vote}">
        </div>
    `)

    $('*[data-number="0"]').addClass("active")
}

function triggerPlugin() {
    if (window.location.pathname == '/movies/movie.html') {
        $("#lightgallery").lightGallery();
    }
}