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
            ${synonyms.map(e => `<span class="synonym">${e}</span>`).join('')}
        </div>
        <div class="title">${antonyms != '' ? 'Antonyms' : ''}</div>
        <div class="antonyms">
            ${antonyms.map(e => `<span class="antonyms">${e}</span>`).join('')}
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