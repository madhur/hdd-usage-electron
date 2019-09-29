const { menubar } = require("menubar");
const diskData = require("./diskdata");
const ipc = require("electron").ipcMain;

const REFRESH_INTERVAL = 5000;

let diskArray = [];

const mb = menubar({
    browserWindow: {
        width: 275,
        height: 120,
        resizable: false
    },
    position: "bottomCenter",
    webPreferences: { nodeIntegration: true }
});

mb.on("ready", () => {
    // console.log(mb);
    //console.log("ready");
    triggerData();
    setInterval(() => {
        triggerData();
    }, REFRESH_INTERVAL);

    // your app code here
});

mb.on("after-create-window", () => {
    //mb.window.setSize(275, 100 * 3, true);
    // mb.window.setPosition(100, 100, false);
    //console.log("after-create-window");
    mb.window.setSize(275, 70 * diskArray.length + 20 + 22 + 8 + 20, true);
    mb.window.webContents.send("data", diskArray);
});

const getData = () => {
    diskData.getBlockData(blockData => {
        diskData.getFsData(fsData => {
            const blockFilteredData = blockData.filter(
                element => element.type == "part"
            );
            const fsFilteredData = fsData.filter(
                element =>
                    element.mount == "/" ||
                    !(
                        element.mount.includes("firmwaresyncd") ||
                        element.mount.includes("Preboot") ||
                        element.mount.includes("private")
                    )
            );

            //const fsFilteredData = fsData;

            diskArray = [];
            fsFilteredData.forEach(element => {
                const free = element.size - element.used;
                const used = (element.used / element.size) * 100;
                let label = element.mount;
                let blockReturned = blockFilteredData.filter(
                    elem => elem.mount == element.mount
                );
                if (blockReturned.length > 0) {
                    label = blockReturned[0].label;
                }

                diskArray.push({
                    free: humanFileSize(free),
                    used: used,
                    label: label
                });
            });
            console.log(diskArray);
        });
    });
};

const triggerData = () => {
    getData();
    if (mb.window) {
        mb.window.setSize(275, 70 * diskArray.length + 20 + 22 + 8, true);
        mb.window.webContents.send("data", diskArray);
    }
};

// console.log(diskData.getFsData(data => console.log(data)));
// console.log(diskData.getBlockData(data => console.log(data)));

function humanFileSize(bytes, si) {
    var thresh = si ? 1024 : 1000;
    if (Math.abs(bytes) < thresh) {
        return bytes + " B";
    }
    var units = !si
        ? ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
        : ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
    var u = -1;
    do {
        bytes /= thresh;
        ++u;
    } while (Math.abs(bytes) >= thresh && u < units.length - 1);
    return bytes.toFixed(2) + " " + units[u];
}
