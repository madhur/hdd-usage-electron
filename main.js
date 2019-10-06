const { menubar } = require("menubar");
const diskData = require("./js/diskdata");
const { app, Menu, BrowserWindow } = require("electron");

const REFRESH_INTERVAL = 5000;

let diskArray = [];
var aboutWindow = null;

const secondaryMenu = Menu.buildFromTemplate([
    {
        label: "About",
        click() {
            if (aboutWindow) {
                aboutWindow.focus();
                return;
            }

            aboutWindow = new BrowserWindow({
                height: 155,
                resizable: false,
                width: 370,
                title: "About HDD Usage",
                minimizable: false,
                fullscreenable: false,
                webPreferences: { nodeIntegration: true }
            });

            aboutWindow.loadURL("file://" + __dirname + "/views/about.html");

            aboutWindow.on("closed", function() {
                aboutWindow = null;
            });
        }
    },
    {
        label: "Preferences",
        click() {
            mb.app.quit();
        }
    },
    {
        label: "Quit",
        click() {
            mb.app.quit();
        },
        accelerator: "CommandOrControl+Q"
    }
]);

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
    triggerData();
    setInterval(() => {
        triggerData();
    }, REFRESH_INTERVAL);

    mb.tray.on("right-click", () => {
        mb.tray.popUpContextMenu(secondaryMenu);
    });
});

mb.on("after-create-window", () => {
    refreshWindow();
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
    refreshWindow();
};

const refreshWindow = () => {
    if (mb.window) {
        mb.window.setSize(275, 70 * diskArray.length + 20 + 22 + 8, false);
        mb.window.webContents.send("data", diskArray);
        mb.tray.setTitle(Math.round(diskArray[0].used).toString() + "%");
    }
};

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
