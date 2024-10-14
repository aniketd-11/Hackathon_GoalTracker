import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import axios from "axios";

export async function GET(
  request: NextRequest,
  { params }: { params: { imageName: string } }
) {
  const imageName = params.imageName;
  console.log(imageName);
  // const imagePath = path.join(
  //   process.cwd(),
  //   "..",
  //   "backend",
  //   "uploads",
  //   imageName
  // );

  // console.log(imagePath);

  // if (fs.existsSync(imageName)) {
  //   const imageBuffer = fs.readFileSync(imageName);
  //   const headers = new Headers();
  //   headers.set("Content-Type", getContentType(imageName));
  //   return new NextResponse(imageBuffer, { status: 200, headers });
  // } else {
  //   return NextResponse.json({ message: "Image not found" }, { status: 404 });
  // }

  const api = `${process.env.BACKEND_API}/uploads/${imageName}`;

  const response = await axios.get(api, {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store", // Ensure no caching
    },
  });

  console.log(response?.data);

  // Return the response as JSON
  return NextResponse.json({
    data: response.data,
    status: 200,
  });
}

// function getContentType(filename: string): string {
//   const ext = path.extname(filename).toLowerCase();
//   switch (ext) {
//     case ".jpg":
//     case ".jpeg":
//       return "image/jpeg";
//     case ".png":
//       return "image/png";
//     case ".gif":
//       return "image/gif";
//     default:
//       return "application/octet-stream";
//   }
// }
