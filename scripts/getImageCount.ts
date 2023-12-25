import fs from "fs";

const path = "./public/images/rooms";

const roomFolders = fs.readdirSync(path).filter((name) => !!Number(name));

const res = roomFolders.reduce(
  (acc, folder) => {
    acc[folder] = fs.readdirSync(`${path}/${folder}`);
    return acc;
  },
  {} as Record<string, string[]>,
);

fs.writeFileSync(
  "./src/app/_assets/roomImages.ts",
  `export const roomImageList = ${JSON.stringify(
    res,
    null,
    2,
  )} as Record<string, string[]>;`,
);
