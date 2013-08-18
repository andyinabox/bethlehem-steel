Bethlehem Steel
================

An interactive website about Bethlehem Steel.

Instructions
-------------

Most of what you need to know for the scrolling

### Dev mode

To enable "dev mode" that allows you to view the current scroll position and various event logs (loading, media playback, etc.), simply add `?dev=1` to the end of `index.html` in your browser window. For example:

	file:///Users/[username]/Sites/bethlehem-steel/public/index.html?dev=1

### Media Asset Loading

Set the assets and the asset root in the [media.js](public/js/config/media.js) configuration file.

### Media Controls

The following `data` attributes are available for controlling media playback based on scroll position. These are available on both the `<video>` and `<audio>` html tags:

 - `data-startmedia`: Start playback at the given scroll position.
 - `data-stopmedia`: Stop playback at the given scroll position.
 - `data-startfadelength`: The length of the start audio fade in scroll units.
 - `data-stopfadelength`: The length of the end audio fade in scroll units.
 - `data-maxvolume`: The maximum volume for this media.
 - `data-minvolume`: The minimum volume for this media.

 #### Examples ####




Helpful Links & Resources
-------------------------

### GitHub

 - [Git Training](http://training.github.com/) training resources from GitHub.
 - [Markdown Syntax](http://daringfireball.net/projects/markdown/syntax#link) and [Github Flavored Markdown](https://help.github.com/articles/github-flavored-markdown) for editing this README
 - [Intro to GitHub for Designers](http://29thdrive.com/blog/intro-to-github-for-designers-using-a-gui-or-command-line/)
 - [GitHub for Mac](http://mac.github.com/) (Handy app with a visual interface)

### Skrollr

 - [GitHub page](https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=1&cad=rja&ved=0CC8QFjAA&url=https%3A%2F%2Fgithub.com%2FPrinzhorn%2Fskrollr&ei=pq4PUuvKOcaAygGHz4Aw&usg=AFQjCNGFYGHnJ9um0BK9lBHcVxidgkNtVQ&sig2=wX7SJvOVlVMRU3_P8vIVCQ&bvm=bv.50768961,d.aWc)
 - [Main Example](http://prinzhorn.github.io/skrollr/) (polka dots)
 - [Examples](https://github.com/Prinzhorn/skrollr/tree/master/examples)

### Misc


Todo
-----

*Andy*

 - [ ] Compile links & resources
 - [ ] Comment current code
 - [ ] Figure out why nothing is showing up on iOS
 - [ ] Preloading issues
 	- [ ] Videos in Safari
 	- [ ] Sounds in chrome when Dev Tools is disabled

*Andrea*


*Susannah*


