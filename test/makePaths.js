var expect = require('chai').expect;
var makePaths = require('../index.js').makePaths;

describe('makePaths', function() {
	var scaffold;
	describe('valid json', function() {
		before(function() {
			scaffold = [{
			  "app": [
			    "index.html",
			    "404.html", {
				    "styles": [
				      "main.scss"
				    ],
				    "scripts": [
				      "entry.js"
				    ],
				    "assets": [{
				      "fonts": [],
				      "images": []
				    }]
					}
				]
			}];
		});

		it('should describe the right file paths when no root is supplied', function() {
			expect(makePaths(scaffold)).to.deep.equal([
				'./app',
				'./app/styles',
				'./app/scripts',
				'./app/assets',
				'./app/index.html',
				'./app/404.html',
				'./app/styles/main.scss',
				'./app/scripts/entry.js',
				'./app/assets/fonts',
				'./app/assets/images'
			]);
		});

		it('should describe the right file paths when a root is supplied', function() {
			expect(makePaths(scaffold, '..')).to.deep.equal([
				'../app',
				'../app/styles',
				'../app/scripts',
				'../app/assets',
				'../app/index.html',
				'../app/404.html',
				'../app/styles/main.scss',
				'../app/scripts/entry.js',
				'../app/assets/fonts',
				'../app/assets/images'
			]);
		})

		it('should not care about missing preceeding .', function() {
			expect(makePaths(scaffold, 'fish')).to.deep.equal([
				'./fish/app',
				'./fish/app/styles',
				'./fish/app/scripts',
				'./fish/app/assets',
				'./fish/app/index.html',
				'./fish/app/404.html',
				'./fish/app/styles/main.scss',
				'./fish/app/scripts/entry.js',
				'./fish/app/assets/fonts',
				'./fish/app/assets/images'
			]);
		});

		it('should not care about trailing /', function() {
			expect(makePaths(scaffold, '../')).to.deep.equal([
				'../app',
				'../app/styles',
				'../app/scripts',
				'../app/assets',
				'../app/index.html',
				'../app/404.html',
				'../app/styles/main.scss',
				'../app/scripts/entry.js',
				'../app/assets/fonts',
				'../app/assets/images'
			]);
		});

		it('should not care about excessive trailing /', function() {
			expect(makePaths(scaffold, '..///')).to.deep.equal([
				'../app',
				'../app/styles',
				'../app/scripts',
				'../app/assets',
				'../app/index.html',
				'../app/404.html',
				'../app/styles/main.scss',
				'../app/scripts/entry.js',
				'../app/assets/fonts',
				'../app/assets/images'
			]);
		});

		it('should describe paths with nested root supplied', function() {
			expect(makePaths(scaffold, 'fish/cat/dog')).to.deep.equal([
				'./fish/cat/dog/app',
				'./fish/cat/dog/app/styles',
				'./fish/cat/dog/app/scripts',
				'./fish/cat/dog/app/assets',
				'./fish/cat/dog/app/index.html',
				'./fish/cat/dog/app/404.html',
				'./fish/cat/dog/app/styles/main.scss',
				'./fish/cat/dog/app/scripts/entry.js',
				'./fish/cat/dog/app/assets/fonts',
				'./fish/cat/dog/app/assets/images'
			]);
		});
	});

	describe('invalid json format', function() {
		var scaffolds = [[1,2,4], [null], [undefined], [[]], '', [{"app": {"scripts": []}}]]
		var counter = 0;
		beforeEach(function() {
			scaffold = scaffolds[counter];
			counter++;
		});
		it('should error when array contains numbers', function() {
			expect(makePaths.bind(null, scaffold)).to.throw();
		});
		it('should error when array contains null', function() {
			expect(makePaths.bind(null, scaffold)).to.throw();
		});
		it('should error when array contains undefined', function() {
			expect(makePaths.bind(null, scaffold)).to.throw();
		});
		it('should error when an array contains an array (not as a key to an object)', function() {
			expect(makePaths.bind(null, scaffold)).to.throw();
		});
		it('should error when passed a plain string', function() {
			expect(makePaths.bind(null, scaffold)).to.throw();
		});
		it('should error when an object key is not an array', function() {
			expect(makePaths.bind(null, scaffold)).to.throw();
		});
	});
});
