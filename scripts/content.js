chrome.storage.local.get(["data"]).then(result => {
    console.log("Data got: ", result);
    const data = result.data;

    function saveData() {
        return chrome.storage.local.set({ data });
    }

    const styleSheet = `
.options-el-btn > .save-snippet-btn {
    background: white;
    border: 2px solid black;
    padding: 7px;
    color: black;
    cursor: pointer;
    font-family: sans-serif;
    font-size: 15px;
}

.options-el-btn > .save-snippet-btn:hover {
    background: black;
    border: 2px solid black;
    color: white;
}

.options-el-btn {
    text-align: center;
    width: 150px;
    background: white;
    padding: 2px;
    color: black;
    position: fixed;
    z-index: 999;
    opacity: 0;
    transition: 0.2s opacity;
    user-select: none;
    font-family: arial;
    display: inline-block;
    box-shadow: 0 0 5px black;
    border-radius: 4px;
    margin: 0;
    backdrop-filter: blur(10px);
}

.save-snippet-tag {
    width: 138px;
    border: 2px solid black;
    font-family: arial;
    border-radius: 0;
    background: white;
    color: black;
}
`;


    // add button HUD
    const optionsEl = document.createElement("div");
    optionsEl.classList.add("options-el-btn");

    const optionsBtn = document.createElement("button");
    optionsBtn.textContent = "+ Save Snippet";
    optionsBtn.classList.add("save-snippet-btn");

    const tagEl = document.createElement("input");
    tagEl.placeholder = "Tag...";
    tagEl.style.display = "none";
    tagEl.classList.add("save-snippet-tag");
    tagEl.maxLength = 16;

    optionsEl.append(optionsBtn, tagEl);

    document.body.appendChild(optionsEl);


    // add CSS
    const style = document.createElement('style');
    style.appendChild(document.createTextNode(styleSheet));

    document.getElementsByTagName('head')[0].appendChild(style);
    console.log('added style-sheet: ', style);

    /**
     * @type {Selection}
     */
    let selection;
    let hasSaved = true;
    let recentSelectedText;

    // add Interaction
    optionsBtn.addEventListener("click", () => {
        if (!hasSaved) return;
        hasSaved = false;

        try {
            recentSelectedText = selection.toString().trim().toLowerCase();
        } catch (e) {
            // yeah i don't know
            console.error(e);
            recentSelectedText = e;
        }

        tagEl.style.display = "inline-block";
        tagEl.focus();
        optionsBtn.style.display = "none";
    });

    tagEl.addEventListener("keydown", e => {
        let text;
        if (e.key == "Enter") {
            text = tagEl.value;
            if (!text) {
                return;
            }
        }

        if (e.key == "Escape") {
            text = "Unnamed";
        }

        if (e.key == "Enter" || e.key == "Escape") {
            tagEl.value = "";
        
            const label = data[text] || [];
            label.push(recentSelectedText);
        
            data[text] = label;
            
            saveData().then(() => {
                hasSaved = true;
                tagEl.style.display = "none";
                optionsBtn.style.display = "inline-block";
                optionsBtn.textContent = "Saved!";
            });
        }
    });

    tagEl.addEventListener("focusout", () => {
        if (!hasSaved) {
            hasSaved = true;
        }
    })

    function gText() {
        optionsBtn.style.display = "inline-block";
        tagEl.style.display = "none";

        selection = document.getSelection();

        if (!selection || !selection.toString()) {
            optionsEl.style.opacity = "0";
            optionsEl.style.top = "-999px";
            optionsEl.style.left = "-999px";
            return;
        }

        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        optionsBtn.textContent = "+ Save Snippet";

        optionsEl.style.opacity = "0.9";
        const optionsElRect = optionsEl.getBoundingClientRect();

        optionsEl.style.left = (rect.x + rect.width / 2 - optionsElRect.width / 2) + "px";
        optionsEl.style.top = (rect.y + optionsElRect.height) + "px";
    }

    document.onmouseup = gText;

});