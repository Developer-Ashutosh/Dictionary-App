## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
- [Author](#author)

## Overview

### The challenge

Users should be able to:

- Search for words using the input field
- See the Free Dictionary API's response for the searched word
- See a form validation message when trying to submit a blank form
- Play the audio file for a word when it's available
- Switch between serif, sans serif, and monospace fonts
- Switch between light and dark themes
- View the optimal layout for the interface depending on their device's screen size
- See hover and focus states for all interactive elements on the page
- **Bonus**: Have the correct color scheme chosen for them based on their computer preferences.

### Links

- Solution URL: [Dictionary App](https://your-solution-url.com)
- Live Site URL: [Dictionary App](https://your-live-site-url.com)

## My process

### Built with

- Semantic HTML5 markup
- CSS custom properties
- Flexbox
- Mobile-first workflow

### What I learned

```css
 fieldset li::marker {
    color: var(--Primary-Shade);
    font-size: .85rem;
}

article:has(.synonyms, .antonyms) {
    margin-top: 1.5rem;
    display: flex;
    gap: 2rem;
}

article :is(.synonym, .antonym) {
    color: var(--Primary-Shade);
    font-weight: 700;
}
```
```js
// Focus on input field
  searchBox.focus();

// Blur event listener for search box to remove border
   searchBox.addEventListener('blur', () => searchBar.classList.remove('apply-border'));

// Function to the desired audio when the play button is clicked
const playAudio = (audio) => {
  const audioBtn = document.querySelector('#audio-btn');
  audioBtn.addEventListener('click', () => new Audio(audio).play());
}
```

## Author

- GitHub - [Ashutosh Kumar](https://www.github.com/Developer-Ashutosh/)
- Frontend Mentor - [@Ashutosh Kuamr](https://www.frontendmentor.io/profile/yourusername)
