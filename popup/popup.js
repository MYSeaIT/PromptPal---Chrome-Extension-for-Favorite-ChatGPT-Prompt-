const savedTags = document.querySelector(".saved-tags");
const favorites = document.querySelector(".favorites");

const tagInput = document.querySelector(".tag");
const promptInput = document.querySelector(".prompt");
const addPromptBtn = document.querySelector(".add-prompt");

chrome.storage.local.get(["data", "favorites"]).then(result => {
    let data = result.data;
    let favs = result.favorites;

    if (!data) {
        data = {};
        chrome.storage.local.set({ data: {} });
    }

    if (!favs) {
        favs = [];
        chrome.storage.local.set({ favs: [] });
    }
    console.log('loaded data: ', result);


    if (data) {
        updateData();
    }

    if (favs) {
        updateFavs();
    }

    function saveData() {
        for (const key in data) {
            if (data[key].length == 0) {
                delete data[key];
            }
        }

        updateData();

        return chrome.storage.local.set({ data });
    }

    function updateData() {
        savedTags.textContent = "";
        for (const tag in data) {
            if (data[tag].length == 0) {
                continue;
            }

            const tagEl = document.createElement("div");
            tagEl.classList.add("tag-cont");

            const titleEl = document.createElement("div");
            titleEl.textContent = tag;
            titleEl.classList.add("tag-title");
            tagEl.append(titleEl);

            const arr = data[tag].sort();

            for (let i = 0; i < arr.length; i++) {
                const prompt = arr[i];

                const promptContEl = document.createElement("div");
                promptContEl.classList.add("prompt-cont");

                const promptEl = document.createElement("div");
                promptEl.classList.add("prompt-txt");
                promptEl.textContent = prompt;

                const optionsEl = document.createElement("div");
                optionsEl.classList.add("prompt-options");

                const delEl = document.createElement("button");
                delEl.classList.add("prompt-del", "prompt-btn");
                delEl.textContent = "🗑️";

                delEl.addEventListener("click", () => {
                    data[tag].splice(i, 1);
                    saveData().then(() => {
                        promptContEl.remove();
                    });
                });

                const editEl = document.createElement("button");
                editEl.classList.add("prompt-edit", "prompt-btn");
                editEl.textContent = "✏️";
                
                const editInputEl = document.createElement("input");
                editInputEl.classList.add("input-el");
                editInputEl.value = prompt;
                editInputEl.style.display = "none";

                editEl.addEventListener("click", () => {
                    editInputEl.style.display = "block";
                    promptEl.style.display = "none";
                });

                editInputEl.addEventListener("keydown", e => {
                    if (e.key == "Enter") {
                        editInputEl.style.display = "none";
                        promptEl.style.display = "block";
                        const value = editInputEl.value;
                        arr[i] = value;
                        saveData().then(() => {
                            updateData();
                        });
                    }
                });

                editInputEl.addEventListener("focusout", () => {
                    editInputEl.style.display = "none";
                    promptEl.style.display = "block";
                    const value = editInputEl.value;
                    arr[i] = value;
                    saveData().then(() => {
                        updateData();
                    });
                });

                const favEl = document.createElement("button");
                favEl.classList.add("prompt-fav", "prompt-btn");
                favEl.textContent = "❤️";

                favEl.addEventListener("click", () => {
                    favs.push(prompt);
                    saveFavs().then(() => {
                        updateFavs();
                    });
                });

                optionsEl.append(favEl, editEl, delEl);

                promptContEl.append(promptEl, editInputEl, optionsEl);

                tagEl.appendChild(promptContEl);
            }

            savedTags.appendChild(tagEl);
        }
    }

    function saveFavs() {
        return chrome.storage.local.set({ favorites: favs });
    }

    function updateFavs() {
        favorites.textContent = "";
        for (let i = 0; i < favs.length; i++) {
            const fav = favs[i];
            const promptContEl = document.createElement("div");

            promptContEl.classList.add("fav-cont");

            const promptEl = document.createElement("div");
            promptEl.classList.add("prompt-txt");
            promptEl.textContent = fav;

            const optionsEl = document.createElement('div');
            optionsEl.classList.add("prompt-options");

            const delEl = document.createElement("button");
            delEl.classList.add("fav-del", "prompt-btn");
            delEl.textContent = "🗑️";

            delEl.addEventListener("click", () => {
                favs.splice(i, 1);
                saveFavs().then(() => {
                    updateFavs();
                });
            });

            const editEl = document.createElement("button");
            editEl.classList.add("fav-edit", "prompt-btn");
            editEl.textContent = "✏️";

            optionsEl.append(editEl, delEl);

            promptContEl.append(promptEl, optionsEl);

            favorites.append(promptContEl);
        }
    }

    addPromptBtn.addEventListener("click", () => {
        const tagVal = tagInput.value;
        const promptVal = promptInput.value;

        const arr = data[tagVal] || [];
        arr.push(promptVal.trim().toLowerCase());

        data[tagVal] = arr;
        updateData();

        tagInput.value = "";
        promptInput.value = "";

        saveData();
    });

    tagInput.addEventListener("keydown", e => {
        if (e.code == "Enter") {
            addPromptBtn.click();
        }
    });

    promptInput.addEventListener("keydown", e => {
        if (e.code == "Enter") {
            addPromptBtn.click();
        }
    });
});