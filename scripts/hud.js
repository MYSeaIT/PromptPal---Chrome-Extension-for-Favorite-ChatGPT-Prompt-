{
    const styleSheet = `.tag-cont {
    background: rgb(243, 243, 243);
    margin: 6px 0;
    padding: 10px;
    border-radius: 4px;
    color: black;
}

.tag-title {
    font-weight: bolder;
}

.prompt-cont {
    padding: 10px;
    background: rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.prompt-cont:nth-child(even) {
    background: rgba(0, 0, 0, 0.2);
}

.prompt-txt {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
    width: 160px;
    user-select: none;
}

.input-el {
    width: 160px;
    outline: none;
    background: rgba(0, 0, 0, 0.5);
    color: white;
}

.prompt-btn {
    background: rgba(255, 255, 255, 0.6);
    border: none;
    cursor: pointer;
    padding: 1px;
}

.prompt-btn:hover {
    background: rgba(255, 255, 255, 0.9);
}

.prompt-options {
    display: flex;
}

.favorites {
    padding: 10px;
    border-radius: 4px;
    margin: 6px 0;
    background: rgb(255, 220, 169);
}

.fav-cont {
    padding: 10px;
    background: rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    color: black;
}

.fav-cont:nth-child(even) {
    background: rgba(0, 0, 0, 0.2);
}

.hud-cont {
    position: absolute;
    background: rgba(0, 0, 0, 0.1);
    padding: 10px;
    height: 100%;
    width: 100%;
    overflow: auto;
}

.hud-cont-cont {
    position: absolute;
    bottom: 0;
    right: 20px;
    height: 300px;
    width: 300px;
}

.refresh, .minimize {
    background: rgba(255, 255, 255, 0.5);
    cursor: pointer;
    padding: 10px;
    border-radius: 4px;
}

.refresh:hover {
    background: rgba(255, 255, 255, 0.8);
}

.minimize {
    position: absolute;
    top: -50px;
    right: 0px;
    background: rgba(255, 255, 255, 0.5);
    border: 1px solid black;
}

.minimize:hover {
    background: rgba(255, 255, 255, 0.3);
}

.hide-it {
    display: none;
}

.no-height {
    height: 0;
}`;

    const textarea = document.querySelector("textarea");

    const style = document.createElement('style');
    style.appendChild(document.createTextNode(styleSheet));

    document.getElementsByTagName('head')[0].appendChild(style);
    console.log('added style-sheet: ', style);

    
    const hudContCont = document.createElement("div");
    hudContCont.classList.add("hud-cont-cont");

    const hudCont = document.createElement("div");
    hudCont.classList.add("hud-cont");

    const savedTags = document.createElement("div");
    savedTags.classList.add("saved-tags");
    const favorites = document.createElement("div");
    favorites.classList.add("favorites");

    const refreshBtn = document.createElement("button");
    refreshBtn.classList.add("refresh");
    refreshBtn.textContent = "🔄Refresh";
    
    const minimizeBtn = document.createElement("button");
    minimizeBtn.classList.add("minimize");
    minimizeBtn.textContent = "🗕 Hide";
    let minimized = false;

    minimizeBtn.addEventListener("click", () => {
        minimizeBtn.textContent = minimized ? "🗕 Hide" : "🗖 Show";

        if (minimized) {
            hudCont.classList.remove("hide-it");
            hudContCont.classList.remove("no-height");
        } else {
            hudCont.classList.add("hide-it");
            hudContCont.classList.add("no-height");
        }

        minimized = !minimized;
    });

    hudCont.append(refreshBtn, favorites, savedTags);
    hudContCont.append(hudCont, minimizeBtn);
    document.body.append(hudContCont);

    chrome.storage.local.get(["data", "favorites"]).then(result => {
        let data = result.data;
        let favs = result.favorites;

        console.log('loaded data: ', result);

        if (!data) {
            data = {};
            chrome.storage.local.set({ data: {} });
        }

        if (!favs) {
            favs = [];
            chrome.storage.local.set({ favs: [] });
        }

        if (data) {
            updateData();
        }

        if (favs) {
            updateFavs();
        }

        refreshBtn.addEventListener("click", () => {
            chrome.storage.local.get(["data", "favorites"]).then(result => {
                data = result.data;
                favs = result.favorites;
                updateData();
                updateFavs();
            });
        });

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

                    let hasCopy = false;
                    promptEl.addEventListener("mousedown", () => {
                        if (hasCopy) return;
                        textarea.value = prompt;
                        navigator.clipboard.writeText(prompt).then(() => {
                            hasCopy = true;
                            promptEl.textContent = "copied!";
                            setTimeout(() => {
                                promptEl.textContent = prompt;
                                hasCopy = false;
                            }, 2000);
                        });
                    });

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
            for (let i = 0; i < favs?.length; i++) {
                const fav = favs[i];
                const promptContEl = document.createElement("div");

                promptContEl.classList.add("fav-cont");

                const promptEl = document.createElement("div");
                promptEl.classList.add("prompt-txt");
                promptEl.textContent = fav;

                let hasCopy = false;
                promptEl.addEventListener("click", () => {
                    if (hasCopy) return;
                    textarea.value = fav;
                    navigator.clipboard.writeText(fav).then(() => {
                        hasCopy = true;
                        promptEl.textContent = "copied!";
                        setTimeout(() => {
                            promptEl.textContent = fav;
                            hasCopy = false;
                        }, 2000);
                    });
                });

                const optionsEl = document.createElement('div');
                optionsEl.classList.add("prompt-options");

                const delEl = document.createElement("button");
                delEl.classList.add("fav-del", "prompt-btn");
                delEl.textContent = "🗑️";

                // 📋

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
    });
}