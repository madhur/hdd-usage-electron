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
        <div id="disk-bar" style={'width':${used}}></div>
        <div id="disk-image">
            <img src="./img/hard-drive-icon.png" height="24" width="24" />
        </div>
    </div>
    <div id="disk-info">${free}</div>
    <hr />
</div>`;

    return str;
};
