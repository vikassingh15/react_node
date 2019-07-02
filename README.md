# Setup

1. Make sure you have [node.js](https://nodejs.org) installed (it's open source and available on all major platforms)
2. Open a command prompt or a terminal in this directory (where you cloned this repo), run `npm install`. This will download dependencies needed to build the scripts for the page into the `node_modules` folder relative to this directory.
3. Run `npm start`. This will build the scripts, start a local test web server, and open your default browser to [`localhost:1337`](http://localhost:1337/).
4. Open the project folder in your favorite text editor ([VS Code](https://code.visualstudio.com/) is our favorite).

## The Situation

You have a client who sells widgets online. She already has a mobile app that allows people to buy her widgets online that works by talking to an existing backend API. She now wants you to wire up a web app to that same API so she can manage what she is selling from the web.

### Tasks

The two files you are interested in to implement these tasks are `public/index.html` & `public/index.js`. Feel free to add as many files as you want to the `public` folder if you need to.

The app is using [webpack](https://webpack.js.org/) to build the scripts and bundle it for the browser. If you don't know what that is, don't fret. All you need to know is that any changes you make within the `public` folder will automatically build. You should be able to make a change, refresh the page, and see the results.

The app is also already pulling in [babel](https://babeljs.io/) with [ES2015](https://babeljs.io/learn-es2015/) & [react](https://facebook.github.io/react/) presets to build the script bundle. This will allow you to write the app using [ES2015](https://babeljs.io/learn-es2015/) & [JSX](https://facebook.github.io/react/docs/jsx-in-depth.html) syntax if you so desire. Again, if you don't know what that is, don't worry about it. You can also just write "normal javascript" (aka [ES5](https://benmccormick.org/2015/09/14/es5-es6-es2016-es-next-whats-going-on-with-javascript-versioning/)) and everything will still work great.

For your convenience, the page is including the [bootstrap](http://getbootstrap.com/) base CSS file. Feel free to use any bootstrap and/or custom styles along with any package, library, or framework available on [npm](https://www.npmjs.com/) to implement the following:

1. Render a table of the existing widgets available for sale. The table should show 2 columns: _Item_ & _Price_. Make a `GET` request on page load to `/items` which will return a JSON array of items with `item` & `price` fields. The data returned from the API will look something like this:

	```json
	[{
		"item": "Thing 1",
		"price": 49.99
	}, {
		"item": "Thing 2",
		"price": 1000.00
	}]
	```

2. Format the _price_ in the table as US Currency (with a dollar sign, commas, and 2 decimal points) _[hint hint](http://openexchangerates.github.io/accounting.js/)_.

3. Sum the price of all items and include it as _Total_ in the footer of the table. Make sure to also format the total as US Currency.

4. Center-align & bold the header fields. Leave the table body & footer item fields left-aligned. Right-align the price field in the table body & footer.

5. Zebra-stripe the table. In other words, highlight every other row with a light-grayish-type color.

6. Add an _Add New_ form to the bottom of the page to add new items to the table. The form should have two text boxes for _Item_ & _Price_. When you submit the form, it should add the new item to the end of the table. It should also save the new item to the server by issuing a `POST` request to `/items`. The `POST` body should be JSON (the server won't accept form data):

	```json
	{
		"item": "My Awesome New Thing",
		"price": 552
	}
	```

	The server will accept decimal values or US currency formatted values (e.g. _$500_) for the _price_ field. **Make sure to avoid a full page refresh when the form submits. The form submission and handling of the results should happen completely client-side.**

7. Add validation to the form to require the item name to not be empty and the price to be greater than zero. The price field should be liberal in what it accepts (e.g. _5000_, _$5000_, _5000.00_, _5,000.00_, & _$5,000.00_ should all be valid values). Inform the user of validation issues in whatever way you deem most appropriate. **Make sure to block submission of the form if validation fails.**
