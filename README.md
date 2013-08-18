Bethlehem Steel
================

An interactive website about Bethlehem Steel.

Instructions
-------------

Most of what you need to know for the scrolling

### Dev mode

To enable "dev mode" that allows you to view the current scroll position and various event logs (loading, media playback, etc.), simply add `?dev=1` to the end of `index.html` in your browser location bar. For example:

	file:///Users/[username]/Sites/bethlehem-steel/public/index.html?dev=1

### Media Asset Loading

Set the assets and the asset root in the [media.js](public/js/config/media.js) configuration file. For local development, you can put a directory in the root of the project called `mediaAssets` and it will automatically be ignored by Git. An example local development file:

```js
define({

	// This sets the root for all of our media. It allows us
	// to develop locally and then upload the files somewhere
	// else and then change the root without having to 
	// change all of our configuration.
	"mediaRoot" : "../localMedia/",

	// Sound files. Currently only mp3s are supported, and
	// all sounds are stored in the "sounds" directory 
	// inside the media root.
	"sounds" : {
		"karaokeTime" : "sounds/karaokeTime.mp3"
	},

	// Sound files. Currently m4v files are supported, 
	// placed in the "videos" folder.
	"videos" : {
		"catSinging" : "videos/catSinging.mp4"
	},

	// Image files. Can be pretty much any type of image
	// supported by browsers, including jpg, png, and gif.
	// Stored in the "images" directory.
	"images" : {
		"catSinging" : "images/catSinging.gif",
		"chzburger" : "images/chzburger.jpg"
	}

});

```

Assets will be automatically added to any media elements in the [index.html](public/index.html) file if you assign a `data-mediaid` attribute that corresponds to an identifier in the [media.js](public/js/config/media.js). See examples below:

#### Videos

When you set the `data-mediaid` attribute to a `<video>` element, it will automatically look in the `images` object within the [media.js](public/js/config/media.js) configuration and grab the correct path.

For instance, the following html will automagically know to load in the "catSinging" video and not the "gatSinging" image":

```html
<video data-mediaid="catSinging" data-startmedia="0"></video>
```

And so when the page loads it will become this behind the scenes:

```html
<video data-mediaid="catSinging" data-startmedia="0">
	<source src="../localMedia/videos/catSinging.mp4" type="video/mp4">
</video>
```

#### Audio

The same behavior applies to `<audio>` elements:

```html
<video data-mediaid="karaokeTime" data-startmedia="0"></video>
```

On page load is converted to:

```html
<video data-mediaid="catSinging" data-startmedia="0">
	<source src="../localMedia/videos/karaokeTime.mp3" type="video/mpeg">
</video>

```

#### Images

There are two ways to include images from [media.js](public/js/config/media.js):

1. Using an `<img>` element (the simple, old-fashioned way)
2. Using the `data-mediaid` attribute on a block-level element with the class `image`, which will add the image using the css `background-image` attribute.

##### The `<img>` method

This method is fairly straightforward. If you use the image's relative path in the `src` attribute of an image element:

```html
<img src="images/chzburger.jpg">
```

It will automatically get changed to the full path:

```html
<img src="../localMedia/images/chzburger.jpg">
```

##### The `data-mediaid` method

This works very similar to the `<video>` and `<audio>` method; if you include a `data-mediaid` attribute that contains the image identifier and add the `image` class to the element, the `background-image` css property will be automagically set:

```html
<div data-mediaid="chzburger" class="image"></div>
```

Becomes

```html
<div data-mediaid="chzburger" class="image" style="background-image:url('../localMedia/images/chzburger.jpg');"></div>
```


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


