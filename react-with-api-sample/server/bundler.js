import Webpack from "webpack";
import WebpackDevServer from "webpack-dev-server";

import webpackConfig from "../webpack.config";

export default function() {
	// fire up webpack an pass in our configuration
	let bundleStart = null;
	const compiler = Webpack(webpackConfig);

	// we give notice in the terminal when it starts bundling and set the time it started
	compiler.plugin("compile", function() {
		console.log("Bundling...");
		bundleStart = Date.now();
	});

	// we also give notice when it is done compiling, including the time it took. Nice to have
	compiler.plugin("done", function() {
		console.log(`Bundled in ${Date.now() - bundleStart}ms!`);
	});

	const bundler = new WebpackDevServer(compiler, {
		// tell webpack to serve our bundled application from the build path
		// when proxying: http://localhost:1337/bundle/ -> http://localhost:3000/bundle/
		publicPath: "/bundle/",

		// rest is terminal configurations
		quiet: false,
		noInfo: true,
		stats: {
			colors: true
		}
	});

	// fire up the development server and give notice in the terminal that we are starting the initial bundle
	bundler.listen(3000, "localhost", function() {
		console.log("Bundling the 'public' directory, please wait...");
	});
}
