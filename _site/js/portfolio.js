$(function () {
	var github_username = $('#githubUser').val();
	var repocache = [];
	var openSourceReposCache = [];
	var featuredProjectsCache = [];
	var user_avatar = null;
	var contributionsCache = [];
	var access_code = 'b9fe89cc1130143d21762ccff1372aef37afca9b'; // Access code permitting view of public account info

	function loadContributions(reponame) {
		var requri   = 'https://api.github.com/repos/' + github_username;
		var repouri  = 'https://api.github.com/repos/' + github_username + '/' + reponame +'/stats/commit_activity';
		var weeklyContributionTotals = [];

		requestJSON(repouri, function(json) {
			if(json.message == "Not Found" || reponame == '') {
				console.log("No Repo Info Found");
			}
			else {
				var allContributions = json.all;
				var contributions;
				$.getJSON(repouri, function(json){
					contributions = json;
					outputPageContent();
				});

				function outputPageContent() {
					for (i=0; i<contributions.length; i++) {
						weeklyContributionTotals.push(contributions[i].total);
					}
				} // end outputPageContent()
			}
		});

		return weeklyContributionTotals;
	}

	function loadRepositories(reponame) {
		var requri   = 'https://api.github.com/repos/' + github_username;
		var repouri  = 'https://api.github.com/repos/' + github_username + '/'+ reponame;
		var weeklyContributionTotals = [];

		requestJSON(repouri, function(json) {
			if(json.message == "Not Found" || reponame == '') {
				console.log("No Repo Info Found");
			}
			else {
				var allContributions = json.all;
				var contributions;
				$.getJSON(repouri, function(json){
					repo = json;
					outputPageContent();
				});

				function outputPageContent() {
					var repoStruct = {
						url: repo.html_url,
						name: repo.name,
						description: repo.description,
						type: repoIsFeatured(repo.name),
						contributions: loadContributions(reponame)
					}
					repocache.push(repoStruct);
				} // end outputPageContent()
			}
		});
	}

	function retrieveOpenSourceProjects () {
		var openSourceProjects = [];
		openSourceProjects.push($('.openSourceProjContainer .item'));
		
		for(i=0; i<openSourceProjects[0].length; i++) {
			var projectStruct = {
				name: openSourceProjects[0][i].id,
				type: "opensource"
			}
			featuredProjectsCache.push(projectStruct);
		}
	}

	function retrieveFeaturedRepoNames() {
		retrieveOpenSourceProjects();
	}

	function repoIsFeatured (repoName) {
		var repoType = "none";
		for(i=0; i<featuredProjectsCache.length; i++) {
			if(featuredProjectsCache[i].name === repoName) {
				repoType =  featuredProjectsCache[i].type;
			}
		}

		return repoType;
	}

	function populateSeparateRepos() {
		for(i=0; i<repocache.length; i++){
			if(repocache[i].type == 'opensource' || repocache[i].type == 'fun') {
				var descriptionTag = $('#'+repocache[i].name).find('#description');
				descriptionTag.append(repocache[i].description);
			}
		}
	}

	function requestJSON(url, callback) {
		$.ajax({
			url: url,
			complete: function(xhr) {
				callback.call(null, xhr.responseJSON);
			}
		});
	}

	var word_list = [
		{text: "Java", weight: 15},
		{text: "HTML", weight: 9, link: "http://jquery.com/"},
		{text: "C#", weight: 6},
		{text: "CSS3", weight: 7},
		{text: "JavaScript", weight: 5},
		{text: "Python", weight: 14},
		{text: "Ruby", weight: 8},
		{text: "git", weight: 4},
		{text: "Linux", weight: 3},
		{text: "OSX", weight: 16},
		{text: "svn", weight: 13},
		{text: "Windows", weight: 10},
		{text: "node", weight: 17},
		{text: "jekyll", weight: 1},
		{text: "slack", weight: 12}
	];

	$('.level-bar-inner').css('width', '0');


	// function stackMax(layer) {
	// return d3.max(layer, function(d) { return d[1]; });
	// }

	// function stackMin(layer) {
	// return d3.min(layer, function(d) { return d[0]; });
	// }

	// function transition() {
	// var t;
	// d3.selectAll("path")
	// 	.data((t = layers1, layers1 = layers0, layers0 = t))
	// 	.transition()
	// 	.duration(2500)
	// 	.attr("d", area);
	// }

	$( document ).ready(function() {
		retrieveFeaturedRepoNames();
		for(i=0; i < featuredProjectsCache.length; i++) {
			loadRepositories(featuredProjectsCache[i].name);
		}

		$('.level-bar-inner').each(function() {
		
			var itemWidth = $(this).data('level');
			
			$(this).animate({
				width: itemWidth
			}, 800);
			
		});
	});
	/* Bootstrap Tooltip for Skillset */
	$('.level-label').tooltip();
});