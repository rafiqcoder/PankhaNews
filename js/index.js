
// COMMON FUNCION FOR FETCHINT DATA AND ERROR HANDELER 
const loadAllNews = async (url) => {
    try { /**ERROR HANDLER */
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        document.getElementById('alert').textContent = "";
        document.getElementById('alert').innerHTML = `<h2 class="text-orange-600 text-2xl border-2 bg-gray-300 p-2 rounded-xl pl-4"> You are facing Error </h2>`;

    }
    /**ERROR HANDLER */

}


const setAllMenu = async () => {
    const url = "https://openapi.programming-hero.com/api/news/categories";

    const apiData = await loadAllNews(url); /**PASSING URL AND GETING RETURN AFTER ERROR HANDLING*/

    const { data } = apiData;
    const { news_category } = data;

    /** LOOP TO DISPLAY CATEGORIES NAV */
    news_category.forEach(category => {


        const li = document.createElement('li');
        li.classList.add('hover:text-primary', 'hover:bg-blue-100')

        if (category.category_id == '08') { /** ACTIVE STYLE TO ALLNEWS CATEGORY */
            li.innerHTML = `<a onclick="clicked_cat('${category.category_id}')" id=${category.category_id} class="selected text-white bg-blue-500">${category.category_name}</a>`;
        } else {
            li.innerHTML = `<a onclick="clicked_cat('${category.category_id}')" id=${category.category_id} class="selected">${category.category_name}</a>`;
        }

        const ul = document.getElementById('all-menu');
        ul.appendChild(li);


    })


}
setAllMenu();

const alertMsg = document.getElementById('alert');

/** FUNCTION TO SHOW ALLNEWSES BY DEFAULT*/
const loadProducts = async () => {
    /** ADDING SPINER BEFORE LOAD*/
    document.getElementById('spiner').classList.remove('hidden');

    const url = `https://openapi.programming-hero.com/api/news/category/08`
    const apiData = await loadAllNews(url);
    const { data } = apiData;

    /** SORTING NEWSES BY VIEWS */
    const datas = data.sort((a, b) => {
        return b.total_view - a.total_view;
    });

    /** CHECKING AND DISPLAYING THE NUMBER OF NEWS FILTERED BY CATEGORY*/
    if (datas.length > 0) {
        alertMsg.innerHTML = `<h2 class="text-2xl font-semibold text-orange-600">  ${datas.length} News Displaying before you </h2>`
    } else {
        alertMsg.innerHTML = `<h2 class="text-xl font-semibold text-orange-500 bg-orange-400"> No Data Found </h2>`
    }



    const cardContainer = document.getElementById('card_container');
    const modalContainer = document.getElementById('modal_container');

    /** lOOP TO SHOW NEWSES BY DEFAULT*/
    datas.forEach((category) => {

        /** DISTRUCTURING THE OBJECTS INTO VARIABLE*/
        const { image_url, title, details, author, rating, total_view, thumbnail_url } = category;
        const { published_date, name, img } = author;

        const cardDiv = document.createElement('div');
        cardContainer.appendChild(cardDiv);

        cardDiv.innerHTML = `<div class="card w-full bg-base-100 shadow-xl flex md:flex-row flex-col flex-none mb-10">
        <figure><img class="w-full max-w-4xl" src=${image_url} alt="" />
        </figure>
        <div class="card-body" onclick="modal('${category._id}')">
        <label for="my-modal-5" class="modal-button card-title md:text-3xl text-2xl font-bold md:mb-3 mb-2">
            ${title}
                
            </label>
            
            <p class="md:text-2xl text-xl md:font-semibold text-gray-500 mb-5 md:pr-10">${details.length > 200 ? title.slice(0, 200) + '...' : details}
            </p>
            <div class="card-actions justify-around">
                <div class="author flex">
                    <img class="20 mr-4" style="width:50px;height:50px; border-radius:50%;" src=${img} alt="">
                    <div class="autor_body" id="card_body">
                    
                        <h3 class="text-xl capitalize">${name == "" || name == null ? 'no data Found' : name}</h3>
                        <h3 class="text-xl capitalize text-gray-400">${published_date == null ? 'no data Found' : published_date}</h3>
                    </div>
                </div>
                <div class=" text-xl font-semibold text-gray-400"><i class="far fa-eye"></i><span
                        id="veiws">${total_view == null ? 'no data Found' : total_view}</span>M </div>
                <div class="rating">
                    <input type="radio" name="rating-1" class="mask mask-star" />
                    <input type="radio" name="rating-1" class="mask mask-star" checked />
                    <input type="radio" name="rating-1" class="mask mask-star" />
                    <input type="radio" name="rating-1" class="mask mask-star" />
                    <input type="radio" name="rating-1" class="mask mask-star" />
                </div>
                <label for="my-modal-5" class="btn modal-button">Details</label>
            </div>
        </div>
    </div>`
    })
    document.getElementById('spiner').classList.add('hidden');

}
loadProducts();


/** DISPLAY CATEGORIES PRODUCTS AFTER CLICKING A SPECIFIC CATEGORY */
const clicked_cat = async (categoryName) => {
    document.getElementById('spiner').classList.remove('hidden'); /** LOADING SPINER */

    document.getElementById('card_container').textContent = ""; /** DELETING THE EXISTING CONTENT*/


    /** lOOP TO SHOW ACTIVE STYLE AFTER CLICKING CATEGORIES*/
    const selectAllCarBtn = document.getElementsByClassName('selected');

    for (const selectSingleBtn of selectAllCarBtn) {
        selectSingleBtn.classList.remove('active');
        selectSingleBtn.classList.remove('bg-blue-500');
        selectSingleBtn.classList.remove('text-white');
    };

    const selectedBtn = document.getElementById(categoryName);
    selectedBtn.classList.add('active');

    /** FETCHING CATEGORIE URL TO SHOW NEWSES */
    const url = `https://openapi.programming-hero.com/api/news/category/${categoryName}`;
    const loadCatNews = await loadAllNews(url)
    const { data } = loadCatNews;
    const { news_category } = data;

    const cardContainer = document.getElementById('card_container');
    /** SORTING BY VIEWS */
    const datas = data.sort((a, b) => {
        return b.total_view - a.total_view;
    });

    if (datas.length > 0) { /** ALERT */
        alertMsg.innerHTML = `<h2 class="text-2xl font-semibold text-orange-600"> ${datas.length} News Found with this category`
    } else {
        alertMsg.innerHTML = `<h2 class="text-2xl  text-red-500 py-3 bg-orange-100 w-9/12 m-auto align-center font-bold text-center"> No Data Found </h2>`
    }

    /** lOOP TO SHOW SELECTED CATEGORIES NEWSES*/
    datas.forEach(category => {
        /** DISTRUCTURING*/
        const { image_url, title, details, author, rating, total_view, thumbnail_url } = category;
        const { published_date, name, img } = author;

        const cardDiv = document.createElement('div');
        cardDiv.classList.add('col');
        cardContainer.appendChild(cardDiv);

        cardDiv.innerHTML = `<div class="card w-full bg-base-100 shadow-xl flex md:flex-row flex-col flex-none mb-10">
        <figure><img src=${image_url} alt="" />
        </figure>
        <div class="card-body">
        <label for="my-modal-5" class="modal-button card-title md:text-3xl text-2xl font-bold md:mb-3 mb-2">
        ${title}
            
        </label>
        <p class="md:text-2xl text-xl md:font-semibold text-gray-500 mb-5 md:p-10">${details.length > 200 ? title.slice(0, 200) + '...' : details}
            </p>
            <div class="card-actions justify-around">
                <div class="author flex">
                    <img class="20 mr-4" style="width:50px;height:50px; border-radius:50%;" src=${img} alt="">
                    <div class="autor_body" id="card_body">
                        <h3 class="text-xl capitalize">${name == "" ? 'no data Found' : name}</h3>
                        <h3 class="text-xl capitalize text-gray-400">${published_date == null ? 'no data Found' : published_date}</h3>
                    </div>
                </div>
                <div class=" text-xl font-semibold text-gray-400"><i class="far fa-eye"></i><span
                        id="veiws">${total_view == null ? 'no data Found' : total_view}</span>M </div>
                <div class="rating">
                    <input type="radio" name="rating-1" class="mask mask-star" />
                    <input type="radio" name="rating-1" class="mask mask-star" checked />
                    <input type="radio" name="rating-1" class="mask mask-star" />
                    <input type="radio" name="rating-1" class="mask mask-star" />
                    <input type="radio" name="rating-1" class="mask mask-star" />
                </div>
                <label for="my-modal-5" class="btn modal-button">Details</label>

            </div>
        </div>
    </div>`
    })

    /** HIDING SPINER AFTER LOADING NEWSES */
    document.getElementById('spiner').classList.add('hidden');
}

// ARROW FUNCTON : Modal opens after clicking card
const modal = async (category) => {
    document.getElementById('spiner').classList.remove('hidden');
    document.getElementById('spiner').style.position="absolute";
    document.getElementById('spiner').style.top="50%";

    const modalContainer = document.getElementById('modal_container');
    modalContainer.textContent = "";
    const url = `https://openapi.programming-hero.com/api/news/${category}`;
    const modalNews = await loadAllNews(url)

    const { data } = modalNews;

    for (datas of data) {
        const { image_url, title, details, author, rating, total_view, thumbnail_url } = datas;
        const { name, img, published_date } = author;

        const modalDiv = document.createElement('div');

        modalDiv.classList.add('modal-box', 'md:w-6/12', 'max-w-5xl');
        modalContainer.appendChild(modalDiv);
        modalDiv.innerHTML = `
        
        <label for="my-modal-5" class="btn md:btn-lg btn-circle absolute right-2 top-2 z-20  md:text-2xl bg-blue-500">✕</label>
        <div class="card bg-base-100 shadow-xl mb-10">
        <figure class=""><img class="w-full" src=${image_url} alt="" />
        </figure>
        <div class="card-body">
            <h2 class="card-title md:text-3xl text-2xl font-bold md:mb-3 mb-2">
            ${title}
                
            </h2>
            <p class="md:text-2xl text-xl md:font-semibold text-gray-500 mb-5 md:p-10">${details}
            </p>
            <div class="card-actions justify-around">
                <div class="author flex">
                    <img class="md:mr-4" style="width:70px;height:70px; border-radius:50%;" src=${img} alt="">
                    <div class="autor_body" id="card_body">
                        <h3 class="text-2xl capitalize">${name == "" || name == null ? 'no data Found' : name}</h3>
                        <h3 class="text-xl capitalize text-gray-400">$${published_date == null ? 'no data Found' : published_date}</h3>
                    </div>
                </div>
                <div class=" text-2xl font-semibold text-gray-400"><i class="far fa-eye"></i><span
                        id="veiws">${total_view == null ? 'no data Found' : total_view}</span> M </div>
                <div class="rating">
                    <input type="radio" name="rating-1" class="mask mask-star" />
                    <input type="radio" name="rating-1" class="mask mask-star" checked />
                    <input type="radio" name="rating-1" class="mask mask-star" />
                    <input type="radio" name="rating-1" class="mask mask-star" />
                    <input type="radio" name="rating-1" class="mask mask-star" />
                </div>
                
            </div>
        </div>
    </div>`
    }
    document.getElementById('spiner').classList.add('hidden');
}



