import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove, set} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://realtime-database-b01dc-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const endorsementListInDB = ref(database, "endorsements")

const inputFieldEl = document.getElementById("input-field")
const publishButtonEl = document.getElementById("publish-button")
const endorsementListEl = document.getElementById("endorsements-list")
const fromFieldEl = document.getElementById("from-field")
const toFieldEl = document.getElementById("to-field")

publishButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value
    let fromValue = fromFieldEl.value
    let toValue = toFieldEl.value
    let likeCount = 0
    
    let endorsementObject = {
        endorsementDB: inputValue,
        fromDB: fromValue,
        toDB: toValue,
        likeCount: likeCount
    }
    push(endorsementListInDB, endorsementObject)
    clearInputFieldEl()
})

onValue(endorsementListInDB, function(snapshot) {
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())
        clearEndorsementListEl()
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            let currentItemID = currentItem[0]
            let currentItemValue = currentItem[1]
            appendItemToEndorsementListEl(currentItem)
        }    
    } else {
        endorsementListEl.innerHTML = "No endorsements here... yet"
    }
})


function clearEndorsementListEl() {
    endorsementListEl.innerHTML = ""
}

function clearInputFieldEl() {
    inputFieldEl.value = ""
    fromFieldEl.value = ""
    toFieldEl.value = ""
}

function appendItemToEndorsementListEl(item) {
    let itemID = item[0]
    let { endorsementDB, fromDB, toDB, likeCount } = item[1]
    
    let newEl = document.createElement("li")
    
    newEl.innerHTML = `
        <h3 class="endorsement-tofrom">To ${toDB}</h3>
        <p class="endorsement-input">${endorsementDB}</p>
        <div class="endorsement-footer">
            <h3 class="endorsement-tofrom">From ${fromDB}</h3>
            <p class="endorsement-like" id="${itemID}">❤️${likeCount}</p>           
        </div>
    `
    let likeButton = newEl.querySelector(`#${itemID}`)

    likeButton.addEventListener("click", function() {
        likeCount += 1
        likeButton.innerHTML = `❤️ ${likeCount}`
        let exactLocationOfItemInDB = ref(database, `endorsements/${itemID}/likeCount`)
        set(exactLocationOfItemInDB, likeCount)
    })
    endorsementListEl.append(newEl)
}


