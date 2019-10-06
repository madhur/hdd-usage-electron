const ipc = require("electron").ipcRenderer;

ipc.on("data", (event, arg) => {
    refreshDom(arg);
});

const refreshDom = diskArray => {
    let finalStr = "";
    diskArray.forEach(disk => {
        finalStr = finalStr + getDomElement(disk);
    });
    document.getElementById("empty-container").innerHTML = "";
    document
        .getElementById("empty-container")
        .insertAdjacentHTML("afterbegin", finalStr);
};

const getDomElement = ({ label, used, free }) => {
    const str = `
   <div id="disk-container">
    <div id="disk-label">
        ${label}
    </div>
    <div id="bar-container">
        <div id="disk-bar"><div id="disk-bar-inner" style="width:${Math.round(
            used
        )}%"></div></div>
        <div id="disk-image">
            <img src="./img/hard-drive-icon.png" height="24" width="24" />
        </div>
    </div>
    <div id="disk-info">${free} free</div>
    <hr />
</div>`;

    return str;
};

const openAboutWindow = () => {
    ipc.send("aobut_window_message");
};

document.getElementById("about-window-anchor").addEventListener("click", () => {
    openAboutWindow();
});

document.getElementById("quit-window-anchor").addEventListener("click", () => {
    sendQuitMessage();
});

const sendQuitMessage = () => {
    ipc.send("quit_message");
};
