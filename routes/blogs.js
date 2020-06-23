const express = require("express");
const router = express.Router();
const { ensureAuth } = require("../middleware/auth");

const Blog = require("../models/Blog");

// @desc    Show all blogs
// @route   GET /blogs
router.get("/", ensureAuth, async (req, res) => {
 try {
  const blogs = await Blog.find({ status: "public" })
   .populate("user")
   .sort({ createAt: "desc" })
   .lean();
  res.render("blogs", {
   me: req.user,
   blogs,
  });
 } catch (err) {
  console.error(err);
  res.render("error/500");
 }
});

// @desc    Show all blogs
// @route   GET /blogs
router.get("/user/:userId", ensureAuth, async (req, res) => {
 try {
  const blogs = await Blog.find({ status: "public", user: req.params.userId })
   .populate("user")
   .sort({ createAt: "desc" })
   .lean();
  res.render("blogs", {
   me: req.user,
   blogs,
  });
 } catch (err) {
  console.error(err);
  res.render("error/500");
 }
});

// @desc    Show edit blog
// @route   GET /blogs/edit/:id
router.get("/edit/:id", ensureAuth, async (req, res) => {
 try {
  const blog = await Blog.findOne({ _id: req.params.id }).lean();
  if (!blog) return res.render("error/404");
  if (blog.user != req.user.id) res.redirect("/blogs");
  else res.render("blogs/edit", { layout: 'editor', blog });
 } catch (err) {
  console.error(err);
  res.render("error/500");
 }
});

// @desc    Add Blog
// @route   GET /blogs/add
router.get("/add", ensureAuth, async (req, res) => {
 res.render("blogs/edit", { layout: "editor" });
});

// @desc    Process add form
// @route   POST /blogs
router.post("/", ensureAuth, async (req, res) => {
 try {
  req.body.user = req.user.id;
  await Blog.create(req.body);
  res.redirect("/dashboard");
 } catch (err) {
  console.error(err);
  res.render("error/500");
 }
});

// @desc    Show single blog
// @route   GET /blogs/:id
router.get("/:id", ensureAuth, async (req, res) => {
  try {
   const blog = await Blog.findById(req.params.id).populate("user").lean();
   if (!blog) return res.render("error/404");
   res.render("blogs/show", {
    me: req.user,
    blog,
   });
  } catch (err) {
   console.error(err);
   res.render("error/500");
  }
 });
 
// @desc    Process edit form
// @route   POST /blogs/update/:id
router.post("/:id", ensureAuth, async (req, res) => {
 try {
  req.body.user = req.user.id;
  await Blog.updateOne({ _id: req.params.id }, { body: req.body.body });
  res.redirect(`/blogs/${req.params.id}`);
 } catch (err) {
  console.error(err);
  res.render("error/500");
 }
});

// @desc    Process edit form
// @route   DELETE /blogs/update/:id
router.delete("/:id", ensureAuth, async (req, res) => {
 try {
  req.body.user = req.user.id;
  await Blog.deleteOne({ _id: req.params.id });
  res.status(200).end();
 } catch (err) {
  console.error(err);
  res.status(204).end();
 }
});



module.exports = router;
