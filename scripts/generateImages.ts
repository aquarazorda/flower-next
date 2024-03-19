import { existsSync, mkdirSync, readdirSync } from "fs";
import { Err, Ok } from "ts-results";
import sizeOf from "image-size";

const getRoomFolders = () => {
  if (existsSync("./images")) {
    return new Ok(readdirSync("./images"));
  } else {
    return new Err("No images folder found");
  }
};

const getImageList = (roomId: string) => {
  if (existsSync("./images/" + roomId)) {
    return new Ok({
      roomId,
      imageNames: readdirSync("./images/" + roomId)?.sort(),
    });
  }

  return new Err("No images folder found for " + roomId);
};

const generateImages = ({
  imageNames,
  roomId,
}: {
  imageNames: string[];
  roomId: string;
}) => {
  const outputDir = "./public/images/rooms";

  if (!existsSync(outputDir)) {
    mkdirSync(outputDir);
  }

  imageNames.forEach((fileName) => {
    if (!existsSync(`${outputDir}/${roomId.split("-")[0]}`)) {
      mkdirSync(`${outputDir}/${roomId.split("-")[0]}`);
    }

    const { width, height } = sizeOf(`./images/${roomId}/${fileName}`);
    if (!width || !height) {
      console.log(`No width or height found for ${roomId} ${fileName}`);
      return new Err("No width or height found");
    }

    const resizeWidth = width > height ? 2738 : 1825;

    const outputFileName = fileName.toLowerCase().replace("jpg", "webp");

    console.log(
      `Generating ${roomId} ${outputFileName} with ${resizeWidth}...`,
    );
    // @ts-ignore
    const res = Bun.spawnSync([
      "cwebp",
      `./images/${roomId}/${fileName}`,
      "-o",
      `${outputDir}/${roomId.split("-")[0]}/${outputFileName}`,
      "-resize",
      resizeWidth,
      "0",
      "-q",
      "80",
      "-exact",
    ]);

    if (!res.success) {
      console.log("Failed to generate image " + fileName + " for " + roomId);
    }
  });
};

const run = () => {
  return getRoomFolders()
    .map((rooms) => rooms.map(getImageList))
    .map((items) => {
      return items.forEach((item) => {
        if (!item.err) {
          return generateImages(item.val);
        }
      });
    });
};

run();
