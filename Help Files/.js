var searchForm = document.querySelector("form.input-search"),
    searchInput = searchForm.querySelector("input"),
    themeToggler = document.querySelector("#isNight"),
    selectedFontIndicator = document.querySelector(".selected-font"),
    selectMenu = document.querySelector(".select-menu"),
    selectOptions = document.querySelectorAll(".select-option"),
    audio;


function audioPlayBtn(elem) {
    audio.play()
}



themeToggler.onchange = e => {
    if (e.target.checked) {
        document.body.classList.add("dark-theme")
    }
    else {
        document.body.classList.remove("dark-theme")
    }
    localStorage.setItem("isNightTheme", e.target.checked)
}


selectedFontIndicator.onclick = e => {
    selectMenu.style.display = "grid";
}

selectOptions.forEach((option, index) => {
    option.onclick = e => {
        selectedFontIndicator.innerText = option.innerText
        selectedFontIndicator.dataset.selectedOption = index;
        document.body.style.fontFamily = e.target.dataset.font;
        localStorage.setItem("chosen-font", e.target.dataset.font)
        selectMenu.style.display = "none";
    }
})


searchForm.onsubmit = e => {
    if (!searchInput.value) {
        e.preventDefault()
        e.target.classList.add("has-error")
    }
}

function get(name) {
    if (name = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)')).exec(location.search))
        return decodeURIComponent(name[1]);
}

// window.onload = () => {
let searchWord = get("search_word")
if (searchWord) {
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${searchWord}`).then(res => { if(res.ok) {return res.json()} throw new Error("404") }).then(data => {
        let template = document.querySelector("template#dict"),
            clone = template.content.cloneNode(true)
        clone.querySelector(".title").innerText = data[0].word
        let phoneticAudio = data[0].phonetics.filter(audio => { if (audio.audio) { return audio.audio } })[0]
        if (phoneticAudio) {
            audio = new Audio(phoneticAudio.audio)
        }
        else {
            clone.querySelector(".audio-spelling").style.display = "none";
        }
        let phonetics = data[0].phonetics.filter(text => { if (text.text) { return text.text } })[0]
        if (phonetics) {
            clone.querySelector("h2").innerText = phonetics.text;
        }
        else {
            clone.querySelector("h2").style.display = "none";
        }
        data[0].meanings.forEach(meaning => {
            let fieldset = `<fieldset class="meaning-container"><legend>${meaning.partOfSpeech}</legend><ul class="meaning">`;
            meaning.definitions.forEach(def => {
                fieldset += `<li><p>${def.definition}</p>`
                if (def.example) {
                    fieldset += `<span class="example">${def.example}</span>`
                }
                fieldset += `</li>`

            })
            fieldset += `</ul>`
            console.log(meaning.synonyms.length)
            if (meaning.synonyms.length) {
                fieldset += `<ul class="synonyms">`
                meaning.synonyms.forEach(synonym => {
                    fieldset += `<li>${synonym}</li>`
                })

                fieldset += `</ul>`
            }
            if (meaning.antonyms.length) {
                fieldset += `<ul class="antonyms">`
                meaning.antonyms.forEach(antonym => {
                    fieldset += `<li>${antonym}</li>`
                })

                fieldset += `</ul>`
            }
            clone.querySelector(".meanings").innerHTML += fieldset
        })
        clone.querySelector(".souce-link > a").href = data[0].sourceUrls[0]
        clone.querySelector(".souce-link > a").innerText = data[0].sourceUrls[0]
        document.querySelector("main").appendChild(clone)

    }).catch(error => {
        document.querySelector("main").appendChild(document.querySelector("template#error").content.cloneNode(true))
    })
    searchInput.value = searchWord
}
// }



/* 

<header>
    <h1>${data[0].word}</h1>
    <button class="audio-spelling"><object data="./assets/images/icon-play.svg" style="width: var(--size-audio-btn, 78px);aspect-ratio: 1;pointer-events: none;"></object>
        <audio>
            <source src="${phoneticAudio.audio}" type="audio/mpeg">
            Your browser does'nt support audio, u mad bro.
        </audio>
    </button>
    <h2>${phoneticAudio.text}</h2>
</header>
<fieldset class="meaning-container">
    <legend>noun</legend>
    <ul class="meaning">
        
        <li>
            <p>(etc.) A set of keys used to operate a typewriter, computer etc.</p>
        </li>
        <li>
            <p>A component of many instruments including the piano, organ, and harpsichord consisting of usually black and white keys that cause different tones to be produced when struck.</p>
        </li>
        <li>
            <p>A device with keys of a musical keyboard, used to control electronic sound-producing devices which may be built into or separate from the keyboard device.</p>
        </li>
    </ul>
    <ul class="synonyms">
        <li><a href="#" class="link">electronic keyboard</a></li>
        <li><a href="#" class="link">mechanic keyboard</a></li>
        <li><a href="#" class="link">none keyboard</a></li>
    </ul>
    <ul class="antonyms">
        <li><a href="#" class="link">wooden stick</a></li>
    </ul>
</fieldset>
<fieldset class="meaning-container">
    <legend>verb</legend>
    <ul class="meaning">
        <li>
            <p>To type on a computer keyboard.</p>
            <span class="example">Keyboarding is the part of this job I hate the most.</span>
        </li>
    </ul>
    <ul class="synonyms">
        <li><a href="#" class="link">fast keyboarding</a></li>
    </ul>
    <ul class="antonyms">
        <li><a href="#" class="link">not doing that</a></li>
        <li><a href="#" class="link">refuse doing that</a></li>
    </ul>
</fieldset>
<div class="souce-link">
<a href="https://en.wiktionary.org/wiki/keyboard" target="_blank">https://en.wiktionary.org/wiki/keyboard <object data="./assets/images/icon-new-window.svg" style="width: 14px; aspect-ratio: 1;"></object></a>
</div>
*/




if (localStorage.getItem("isNightTheme") == "true") {
    document.body.classList.add("dark-theme");
    themeToggler.checked = true;
}

let fonts = {
    "'Inter'": "Sans Serif",
    "'Insolata'": "Mono",
    "'Lora'": "Serif"
}

var chosenFont = localStorage.getItem('chosen-font');
if (chosenFont) {
    document.body.style.fontFamily = chosenFont;
    selectedFontIndicator.innerText = fonts[chosenFont];
}
