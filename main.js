const { menubar } = require("menubar");
const diskData = require("./diskdata");
const REFRESH_INTERVAL = 10000;

const validDiskTypes = ["disk"];
const mb = menubar({
    browserWindow: {
        width: 275
    },
    position: "trayRight"
});

mb.on("ready", () => {
    console.log("app is ready");

    // your app code here
});

console.log(diskData.getFsData(data => console.log(data)));
console.log(diskData.getBlockData(data => console.log(data)));
