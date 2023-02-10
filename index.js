const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.port || 5000;

app.use(cors());
app.use(express.json());
const uri =
  "mongodb+srv://codeGalleryRedux:codeGalleryRedux@cluster0.bnskqpv.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    const blogsCollection = client.db("CodeGalleryRedux").collection("blogs");

    // Add a Blog
    app.post("/blog", async (req, res) => {
      const blog = req.body;
      const result = await blogsCollection.insertOne(blog);
      res.send(result);
    });

    // All Blogs Get
    app.get("/blogs", async (req, res) => {
      const blogs = await blogsCollection.find({}).toArray();
      res.send(blogs);
    });

    // Single Blog Get
    app.get("/blogs/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const blog = await blogsCollection.findOne(query);
      res.send(blog);
    });

    // Delete a Blogs
    app.delete("/blog/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await blogsCollection.deleteOne(filter);
      res.send(result);
    });

    // Update a Blog
    app.patch("/blogs/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };

      const updatedBlog = req.body;

      const updateDoc = {
        $set: updatedBlog,
      };
      const result = await blogsCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    //
  } catch (error) {
    console.error(error);
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Code Gallery redux server is running");
});

app.listen(port, () => {
  console.log("Code Gallery redux server is running on", port);
});
