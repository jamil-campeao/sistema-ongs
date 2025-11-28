export const getFileNameFromUrl = (url: string, baseName: string = "imagem") => {
  try {
    const urlObj = new URL(url);
    const pathSegments = urlObj.pathname.split("/");
    let fileName = pathSegments[pathSegments.length - 1];

    fileName = fileName.split("?")[0];

    if (
      !fileName ||
      fileName === "." ||
      fileName.lastIndexOf("/") === fileName.length - 1
    ) {
      return `${baseName
        .replace(/\s+/g, "_")
        .toLowerCase()}_${new Date().getTime()}.jpg`;
    }

    return fileName;
  } catch (error) {
    console.warn(
      "Could not parse image URL for filename, using default.",
      url
    );
    return `${baseName
      .replace(/\s+/g, "_")
      .toLowerCase()}_${new Date().getTime()}.jpg`;
  }
};
