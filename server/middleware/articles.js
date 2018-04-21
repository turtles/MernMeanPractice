const mongoose = require('mongoose');

const Article = mongoose.model('article');

const createArticle = (args) => {
    console.log(args);
    if (args.title.trim() === "" || args.body.trim() === "") {
      throw new Error('Articles must have a title and a body.');
    }
    
    const article = new Article({
      owner: args.owner,
      title: args.title,
      body: args.body,
      tags: args.tags
    });

    article.save();
};


module.exports = { createArticle };
