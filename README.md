<p align = "center">
  <img src = "Assets\images\pngs\Title.png" size = 200>
</p>

# Syncope

Do you like fighting virtual enemies and typing on your keyboard? <br>
Syncope is the perfect game for people of all ages like yourself! <br> <br>
It is a typing game merged with a boss battle elememts where a user would be given a selection of words to type out, and based on the complexity, category, and speed at which you type the words, will detemine the amount of damage dealt onto the enemy!


## Design Process

We went with a **2-Dimensional** (2D) based art style as it was simplier to create and draw within a short amount of time.
We chose an **(x)** colour theme and **(y)** type of font as it **(explanation)**


### User Stories :

- As a **Student**, I want to have fun while learning new english words.
- As a **Foreigner**, I want to learn english how to type english words on a keyboard.

### Wireframe :
Link to **Wireframe** : [Adobe XD](https://www.google.com)

## Features

### Existing Features

- **Word Prediction** - Automatically predicts which word (out of the 3) the user is typing
- ...


### Features Left to Implement

- Multiple Levels
- Enemy Health Scaling
- ...

## Technologies Used

- [JQuery](https://jquery.com)
  > The project uses **JQuery** to simplify DOM manipulation.

- [SASS](https://sass-lang.com/)
  > The project uses **JQuery**, a powerful CSS extension language for styling

## Preview Screenshots

-- To be Updated Once Completed --

## Development

Development Documentation

### Coding Conventions

<details>
<summary>Naming Conventions ...</summary>
    
| Type                                                         | Apply                                                        |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| camelCase                                                    | Variable name                                                |
| Formal<br />(like camelCase but first capital must be upper case, etc., MyName) | Class name<br />Class Properties<br />Function Name<br />Asset File Name<br />Folder Name |

---
</details>

<details>
<summary>Prefix ...</summary>
For Boolean type variable put 'is', 'has' related word in front of the variable name, etc., IsComplete, IsRequire, hasOrder, hasTicket.
</details> <br>

### Testing
1. Creating a new user (Username Restrictions + Generate Secret Code)
   - Start Game
   - Override previous game
   - Defeat enemy
   - Submit time to leaderboard (yes)
   - Spam your keyboard (More than 15 chars)
   - Should be prompted to retype Username (something less than 15 chars)
   - A secret code would be generated for the user (6 chars long) 
<br><br>
2. Updating Personal score
   - Start Game
   - Override previous game
   - Defeat enemy
   - Submit time to leaderboard (yes)
   - Enter an existing Username
   - User would be prompted to enter the secret key given when creating a user
   - If key is incorrect, user will be prompted if they would like to try again. (no = return to main menu)
   - If key is correct, time will be updated. 
<br><br>
3. Gameplay
   - Start Game
   - Override previous game
   - Typing a letter that corresponds with one of the letters will cause the word to be "selected" (based on auto prediction)
   - The letters of the selected word would be highlighted as the user continues to enter the correct characters (in correct sequence + case sensitive)
   - There will be a penalty (time reduction) for every typo made by the user
<br><br>
4. Leaderboard
   - Click on leaderboard in main menu
   - Leaderboard would appear in the middle of the screen
   - Top 10 players would be displayed (Based on different difficulty, levels & time taken)
   - Close the leaderboard
   - Spam the leaderboard button again
   - Leaderboard should be fine and should not updated/append anymore after the first initalization.

### Bugs / Problems
[Fixed] Javascript Async -- Functions would run without waiting for API Response to finish and returns null.


## Credits

### Contributions
<details>
<summary>Jimmy Lew (Mainly Front End)</summary>
- > index.html <br>
- > menu.html <br>
- > game.html <br>
- > CSS Files <br>
- > SASS Files <br>
- > disableZoom.js
- > * JS Code Cleaner (Helps to Simplify & Clean Up JS Functions) [Mostly after Addison Implements Functions] <br>
- > SWAL.js <br>
- > menu.js (Everything except sound part) <br>
- > LocalStorage.js <br>
- > Helped with ComboChaining (attack.js) <br>
- > Helped with .json + enemy,js & player.js constructors <br>
- > Artist & Art Designer

---
</details>

<details>
<summary>Addison Chua (Mainly Backend End)</summary>
- > api.js <br>
- > attack.js <br>
- > DOMInteraction.js <br>
- > main.js <br>
- > leaderboard.js + HTML <br>
- > menu.js (Only audio part) <br>
- > enemy.js <br>
- > player.js <br>
- > bosses.json <br>
- > levels.json <br>
- > Helped with DefineWordTime (localStorage.js) <br>
- > Wireframe Designs (Both High Fidelity & Low Fidelity) <br>
- > README.md <br>
- > Assist Jimmy In Front End <br>
- > Music / Audio Producer

---
</details> <br>

### Content
* NO Text Content Was Copied From Any External Source

### Media
* **ALL ART ASSETS** were done by : **Jimmy Lew**
** <details><summary>PROOF OF WORK</summary></details> <br>
* **ALL AUDIO ASSETS** were done by : **Addison Chua**
* ** <details><summary>PROOF OF WORK</summary></details> <br>

### API

- [Mc Naveen Random Word API](https://github.com/mcnaveen/Random-Words-API) - Used to generate random english words with definitions.

### Acknowledgements

- [MonkeyType](https://monkeytype.com/) - WPM Calculator to test how fast a user can type
- [TypeRacer](https://play.typeracer.com/) - A competitive typing game where the user with the highest WPM wins a race
- [Hollow Knights](https://static.wikia.nocookie.net/essentialsdocs/images/7/70/Battle.png/revision/latest?cb=20190219202514) - Inspiration for Player Attack UI
