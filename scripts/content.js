{
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
`;


    // add button HUD
    const optionsEl = document.createElement("div");
    optionsEl.classList.add("options-el-btn");

    const optionsBtn = document.createElement("button");
    optionsBtn.textContent = "+ Save Snippet";
    optionsBtn.classList.add("save-snippet-btn");
    optionsEl.appendChild(optionsBtn);

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

    // add Interaction
    optionsBtn.addEventListener("click", () => {
        if (!hasSaved) return;
        hasSaved = false;
        chrome.storage.local.get(["data"]).then(result => {
            console.log("Data got: ", result);
            const text = prompt("Label:");

            if (!text) {
                return;
            }

            let dataSave = {};

            if (result.data) {
                dataSave = result.data;
            }

            const label = dataSave[text] || [];
            label.push(selection.toString().trim().toLowerCase());

            dataSave[text] = label;

            chrome.storage.local.set({ data: dataSave }).then(() => {
                hasSaved = true;
                optionsBtn.textContent = "Saved!";
            });
        });
    });

    function gText() {
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
}