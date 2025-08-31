import axios from "axios";
import parser from "fast-xml-parser";

export default async function handler(req, res) {
  const { url } = req.query;
  // return res.status(200).json({ url, method, headers, responseType, data });
  await axios({ url, responseType: "arraybuffer" })
    .then((response) => {
      return res.status(200).send(response.data);
    })
    .catch((err) => {
      return res.status(200).send(err?.data);
    });
}
