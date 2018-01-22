// Default tab
switchTab("tab-1", "tab-current");

// Output saved notes to list tab
populateNoteList();

// Save button
document.getElementById("button-save").addEventListener("click", saveNote);

// New button
document.getElementById("button-new").addEventListener("click", newNote);

// Add tab switch functionality on tab-1 and tab-2
document.getElementById("tab-1").addEventListener("click", function(){switchTab("tab-1", "tab-current")});
document.getElementById("tab-2").addEventListener("click", function(){switchTab("tab-2", "tab-list")});

// Function to add tab switch functionality to an element (linkName)
function switchTab(linkName, tabName) {
    // Add 'displaynone' to all tab tab-nav elements
    for (var i = 0; i < document.getElementsByClassName("tab-content").length; i++) {
        document.getElementsByClassName("tab-content")[i].classList.add("displaynone");
    }

    // Remove 'active' class from all tab-nav elements
    for (var i = 0; i < document.getElementsByClassName("tab-nav").length; i++) {
        document.getElementsByClassName("tab-nav")[i].classList.remove("active");
    }

    // Remove 'displaynone' class from clicked tab
    document.getElementById(tabName).classList.remove("displaynone");
    // Add 'active' class back to clicked tab
    document.getElementById(linkName).classList.add("active");
}

// Saves current note to chrome.storage
function saveNote(){

    // Name input field
    var name_field = document.getElementById("note-title");

    // If field is blank, cancel
    if(name_field.value.length < 1){
        return;
    }

    // Create variables from the note, title and make a last modified date
    var note = document.getElementById("note-content").value;
    var title = document.getElementById("note-title").value.replace(/ /g,"_");
    var last_modified = Date.now();

    // Put variables in chrome storage (object key will be the title)
    chrome.storage.sync.set({
        [title] : {
            "title"         : title,
            "note"          : note,
            "last_modified" : last_modified
        }
    });
}

// Retrieves all data from chrome.storage and outputs it to the list tab
function populateNoteList(){
    // Retrieves all data from chrome.storage and puts it in items
    chrome.storage.sync.get(null, function(items) {
        // Loop through each item in items
        for(var item in items){
            // Closure for event listener in a loop
            (function (item) {
                // Only take items with an actual value
                if (items.hasOwnProperty(item)) {
                    // New list element
                    var node = document.createElement("li");
                    // Add unique id and title
                    // node.setAttribute("id", items[item].title);
                    node.setAttribute("class", "clearfix");
                    node.innerHTML = "<div class='note-title' id='" + items[item].title + "'>" + items[item].title + "</div>" + "<button id='delete-" + items[item].title + "' class='button button-delete material'></button>";
                    // Add note to list
                    document.getElementById("notes-list").appendChild(node);
                    // Add event listener for when the note is clicked
                    document.getElementById(items[item].title).addEventListener("click", function(){showNote(items[item].title)}, false);
                    // Add event listener for when delete button is clicked
                    document.getElementById('delete-'+items[item].title).addEventListener("click", function(){deleteNote(items[item].title)}, false);
                }
            // End of closure
            }(item));
        }
    })
}

// Shows a note when it is clicked
function showNote(key){
    // Get the clicked note from chrome.storage
    chrome.storage.sync.get(key, function(item){
        // Output its value to the note-content textarea
        document.getElementById("note-content").value = item[key].note;
        document.getElementById("note-title").value = item[key].title;
    });
    // Switch to the tab with textarea 
    document.getElementById("tab-1").click();
}

// Clears textarea and title for new note
function newNote(){
    document.getElementById("note-content").value = '';
    document.getElementById("note-title").value = '';
}

// Deletes passed note
function deleteNote(noteTitle){
    // Remove note from chrome.storage
    chrome.storage.sync.remove(noteTitle, function(){
        // Remove element from DOM
        document.getElementById(noteTitle).parentElement.remove();
    });
}