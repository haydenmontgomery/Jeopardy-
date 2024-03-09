// categories is the main data structure for the app; it looks like this:

//  [
//    { title: "Math",
//      clues: [
//        {question: "2+2", answer: 4, showing: null},
//        {question: "1+1", answer: 2, showing: null}
//        ...
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null},
//        ...
//      ],
//    },
//    ...
//  ]

//The new api for jeopardy only has 14 categories with the ids of 2, 3, 4, 6, 8, 9, 10, 11, 12, 13, 14, 15, 17, 18  
//Will use an array to pick which ones to randomly use
const id = [2, 3, 4, 6, 8, 9, 10, 11, 12, 13, 14, 15, 17, 18];

const newGame = document.querySelector("#start");
newGame.addEventListener('click', showLoadingView);

let categories = [];


/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */

function getCategoryIds() {
    for (let i = id.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        [id[i], id[j]] = [id[j], id[i]];
    }

    return id.slice(0,6);
}

/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */

function getCategory(catId) {
    const catOjbect = {
        title: catId.data.title,
        clues: catId.data.clues
    }

    return catOjbect;
}

/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

async function fillTable() {
    const $tableDiv = $('#table-div')
    console.log($tableDiv);
    const table = document.createElement('table')
    table.id = "jeopardy";
    const tHead = document.createElement('tHead');
    const trHead = document.createElement('tr');
    const tBody = document.createElement('tbody')
    table.classList = "table";
    
    for (let i = 0; i < 6; i++) {
        const tr = document.createElement('tr');
        for (let j = 0; j < 6; j++) {
            const td = document.createElement('td');
            if (i != 0) {
                td.addEventListener('click', handleClick);
                td.innerText = "?"
                td.id = `${i-1}${j}`
                console.log(td.id);
            } else {
                console.log(`${j}  ${i}`);
                td.innerText = categories[j].title;
            }
            tr.appendChild(td);
        }
        if (i == 0) {
            tHead.appendChild(tr)
        } else {
            tBody.appendChild(tr);
        }
    }

    table.appendChild(tHead);
    table.appendChild(tBody);
/*     for(let cat in categories) {
        const td = document.createElement('td');
        console.log(categories[cat].title);
        td.innerText = categories[cat].title;
        trHead.appendChild(td);
    }
    tHead.appendChild(trHead);
    table.appendChild(tHead);

    for (let i = 0; i < 6; i++){
        const trBody = document.createElement('tr');
        for(let cat in categories) {
            const td = document.createElement('td');
            console.log(categories[cat]);
            td.innerText = categories[cat].clues;
            trBody.appendChild(td);
        }
    } */
    $tableDiv.append(table);
}

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

function handleClick(evt) {
    let str = evt.target.id.split('')
    console.log(str);
    let row = str[0];
    let col = str[1];
    let question = categories[col].clues[row].question;
    let answer = categories[col].clues[row].answer;

    if (evt.target.innerText == "?"){
        evt.target.innerText = question;
    } else if (evt.target.innerText == question) {
        evt.target.innerHTML = answer;
        evt.target.style.backgroundColor = "#28a200";
    }
}

/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

function showLoadingView() {

}

/** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView() {
}

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setupAndStart() {
    const categoryID = getCategoryIds();
    //const res = await axios.get("https://rithm-jeopardy.herokuapp.com/api/category?id=3");
    //const categories = []
    try {
        for (let cat in categoryID){
            const res = await axios.get(`https://rithm-jeopardy.herokuapp.com/api/category?id=${categoryID[cat]}`);
            categories[cat] = getCategory(res);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }    
    fillTable();

    console.log(categories[0]);
    console.log(categories[1]);
    console.log(categories[2]);
    console.log(categories[3]);
    console.log(categories[4]);
    console.log(categories[5]);
        
}

/** On click of start / restart button, set up game. */

// TODO

/** On page load, add event handler for clicking clues */

// TODO