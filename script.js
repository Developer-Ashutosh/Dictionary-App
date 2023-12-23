// Get the root element of the document
const rootElement = document.documentElement;
const main = document.querySelector('main');

// Function to toggle fonts list
const toggleFontsList = () => {
    // Get the required elements
    const title = document.querySelector(".dropdown .title");
    const fontList = document.querySelector(".font-list");

    // Function to change font style
    const changeFontStyle = (font) => {
        title.querySelector('#active-font').textContent = font.textContent;
        rootElement.setAttribute('data-font', font.getAttribute('data-font'));
        document.querySelector('#search-box').setAttribute('data-font', font.getAttribute('data-font'));
        localStorage.setItem('prefered-font-title', font.textContent);
        localStorage.setItem('font-preference', rootElement.getAttribute('data-font'));
    };

    // Event listener for title click to toggle font list
    title.addEventListener("click", () => {
        fontList.classList.toggle('drop');
        title.querySelector('img').classList.toggle('rotate');
    });

    // Set the font style to stored font preference in local storage, if any
    if (localStorage.getItem('font-preference')) {
        changeFontStyle(fontList.querySelector(`[data-font="${localStorage.getItem('font-preference')}"]`));
    }

    // Change font style to the clicked style
    fontList.addEventListener('click', (e) => {
        const font = e.target.closest('LI');
        if (font) {
            changeFontStyle(font);
            fontList.classList.remove('drop');
            title.querySelector('img').classList.remove('rotate');
        }
    });
};

// Function to toggle theme
const toggleTheme = () => {
    // Get the required elements
    const themeBar = document.querySelector(".theme-bar");
    const themeIcon = document.querySelector(".theme-icon img");

    // Function to set theme
    const setTheme = (theme) => {
        rootElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme-preference', theme);
        themeBar.classList.toggle("toggle-theme", theme === 'dark');
        themeIcon.src = (themeIcon.src.includes('icon-sun.svg')) ? './images/icon-moon.svg' : './images/icon-sun.svg';
    };

    // Set the theme to stored theme preference in local storage, if any
    if (localStorage.getItem('theme-preference')) {
        setTheme(localStorage.getItem('theme-preference'));
    }

    // Toggle between light and dark themes
    themeBar.addEventListener("click", () => {
        const newTheme = rootElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    });
};

// Function to apply border & to focus on the input field
const enhanceSearchBarInteraction = () => {
    // Get the required elements
    const searchBar = document.querySelector(".search-bar");
    const searchBox = searchBar.querySelector('#search-box');

    searchBar.addEventListener('click', (e) => {
        if (e.target === searchBar || e.target.id === 'search-box') {
            // Focus on input field
            searchBox.focus();
            // Apply border to the search bar
            searchBar.classList.add('apply-border');
        }
    });

    // Blur event listener for search box to remove border
    searchBox.addEventListener('blur', () => searchBar.classList.remove('apply-border'));
};

// Function to initiate search on button click or Enter key press
const initiateSearch = () => {
    // Get the required  elements
    const searchBox = document.querySelector("#search-box");

    if (searchBox.value.trim() !== '') {
        fetchData(searchBox.value);
        loader.style.display = "inline-block";
    } else {
        displayError('Oops🙂 You forgot to enter a word to search. Try Again!');
        main.innerHTML = `
            <div class="welcome-page">
                <h1>Welcome to the Dictionary App!</h1>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M12 9.7998V19.9998M12 9.7998C12 8.11965 12 7.27992 12.327 6.63818C12.6146 6.0737 13.0732 5.6146 13.6377 5.32698C14.2794 5 15.1196 5 16.7998 5H19.3998C19.9599 5 20.2401 5 20.454 5.10899C20.6422 5.20487 20.7948 5.35774 20.8906 5.5459C20.9996 5.75981 21 6.04004 21 6.6001V15.4001C21 15.9601 20.9996 16.2398 20.8906 16.4537C20.7948 16.6419 20.6425 16.7952 20.4543 16.8911C20.2406 17 19.961 17 19.402 17H16.5693C15.6301 17 15.1597 17 14.7334 17.1295C14.356 17.2441 14.0057 17.4317 13.701 17.6821C13.3568 17.965 13.096 18.3557 12.575 19.1372L12 19.9998M12 9.7998C12 8.11965 11.9998 7.27992 11.6729 6.63818C11.3852 6.0737 10.9263 5.6146 10.3618 5.32698C9.72004 5 8.87977 5 7.19961 5H4.59961C4.03956 5 3.75981 5 3.5459 5.10899C3.35774 5.20487 3.20487 5.35774 3.10899 5.5459C3 5.75981 3 6.04004 3 6.6001V15.4001C3 15.9601 3 16.2398 3.10899 16.4537C3.20487 16.6419 3.35774 16.7952 3.5459 16.8911C3.7596 17 4.03901 17 4.59797 17H7.43073C8.36994 17 8.83942 17 9.26569 17.1295C9.64306 17.2441 9.99512 17.4317 10.2998 17.6821C10.6426 17.9638 10.9017 18.3526 11.4185 19.1277L12 19.9998"
                        stroke="#fff" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            </div>`;
        loader.style.display = "none";
    }

};

// Function to fetch data from dictionary API
const fetchData = async (searchedWord) => {
    try {
        // Fetch data from the API
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${searchedWord}`);
        const data = await response.json();
        updateData(data);
        loader.style.display = "none";
    } catch (error) {
        displayError('Error while searching the word. Reckeck the word! (spelling etc.)')
    }
};

// Function to update data received from dictionary API into HTML structure
const updateData = (data) => {
    // Extract relevant information from the API response
    const [{ word, phonetic, meanings, sourceUrls }] = data;

    main.innerHTML = '';
    let section = document.createElement('section');
    section.className = 'phonetics';

    section.innerHTML = `
        <div class="term-container">
            <h1 id="word">${word}</h1>
            <h3 id="phonetic">${phonetic ? phonetic : ''}</h3>
        </div>
        <div id="audio-btn">
            <img src="./images/icon-play.svg" alt="">
        </div>`;
    main.append(section);

    meanings.forEach(meaning => {
        const { partOfSpeech, definitions, synonyms, antonyms } = meaning;
        let fieldset = document.createElement('fieldset');

        fieldset.innerHTML += `
        <legend class="part-of-speech">${partOfSpeech}</legend>
        <article>
            <div class="title">Meaning</div>
            <ul>
                <div class="definitions">
                    ${definitions.map(e => `<li class="definition">${e.definition}</li> <div class="example"> ${e.example ? `Eg: "${e.example}" ` : ''} </div >`).join('')}
                </div >
            </ul >
        </article >
        <article>
            <div class="title">${synonyms != '' ? 'Synonyms' : ''}</div>
            <div class="synonyms">
                ${synonyms.map((e, index) => `<span class="synonym">${e}${index === synonyms.length - 1 ? '' : ';'}</span>`).join('')}
            </div>
        </article>
        <article>
            <div class="title">${antonyms != '' ? 'Antonyms' : ''}</div>
            <div class="antonyms">
                ${antonyms.map((e, index) => `<span class="antonym">${e}${index === antonyms.length - 1 ? '' : ';'}</span>`).join('')}
            </div>
        </article>`;
        main.append(fieldset);
    });

    let footer = document.createElement('footer');

    footer.innerHTML = `Source:
<a href="${sourceUrls[0]}" target="_blank" id="source-url">
    <span>${sourceUrls[0]}</span>
    <img src="./images/icon-new-window.svg" alt="">
</a>`;
    main.append(footer);


    playAudio(data[0].phonetics.find(phonetic => phonetic.audio));
};

// Function to the desired audio when the play button is clicked
const playAudio = (audio) => {
    const audioBtn = document.querySelector('#audio-btn');
    audioBtn.addEventListener('click', () => new Audio(audio.audio).play());
};

// Function to handle errors
const displayError = (message) => {
    const errorBox = document.querySelector('#error-box');

    errorBox.textContent = message;
    errorBox.style.top = "50%";
    setTimeout(() => {
        errorBox.style.top = "-100%";
    }, 3000);
    loader.style.display = "none";
};

// Call the functions to initialize the features
toggleFontsList();
toggleTheme();
enhanceSearchBarInteraction();
document.querySelector("#search-btn").addEventListener('click', initiateSearch);
document.addEventListener('keydown', (event) => (event.key === 'Enter') ? initiateSearch() : null);