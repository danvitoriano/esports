const express = require("express");
const app = express();
const port = 3001;

app.get(
  "/ads",
  (_req: any, res: { json: (arg0: { id: number; title: string; }[]) => any; }) => {
    return res.json([
      { id: 1, title: "Ad 1" },
      { id: 2, title: "Ad 2" },
      { id: 3, title: "Ad 3" },
      { id: 4, title: "Ad 4" },

    ]);
  }
);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
