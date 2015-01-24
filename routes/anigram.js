var express = require('express')
var router = express.Router()
var fs = require('fs')
var path = require('path')

router.get('/:anigram_name', function (req, res) {
  var anigram = req.params.anigram_name

  fs.exists(anigramPath + '/' + anigram, function (anigramExists) {
    if (anigramExists)
      res.render("anigram", { anigram: anigram, anigrams: anigrams })
    else
      res.redirect('/')
  })
})

router.get('/', function(req, res) {
  res.redirect('/')
})

module.exports = router
