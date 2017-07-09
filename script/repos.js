window.onload = function openAngularRepoApi() {
    'use strict';
    var request = new XMLHttpRequest();
    request.open('get', 'https://api.github.com/orgs/angular?access_token=50321170cf051bd5a31b5950f2e8929d18a125f4', true);
    request.send();
    request.response;
    request.onload = read100repositories;
    createUserDivs();
}

function read100repositories() {
    var request = new XMLHttpRequest();
    request.open('get', 'https://api.github.com/orgs/angular/repos?page=1&per_page=100', true);
    request.send();
    request.response;
    request.onload = add100ReposToHTML;
    createRepositoryDivs();
}

function createRepositoryDivs() {
    var str = "";
    for (var index = 0; index < 100; index++) {
        str += "<span id=\"repository" + index + "\" class=\"col-md-9 col-xs-9	col-sm-9 col-lg-9\"></span>"
            + "<a id=\"repoUrl" + index + "\" target=\"_blank\" class=\"col-md-3 col-xs-3 col-sm-3 col-lg-3\"><button class=\"btn btn-success mediumButton\">View repo page</button></a><br />";
    }
    document.getElementById('repos').innerHTML = str;
}

function add100ReposToHTML() {
    var githubUrl = "https://github.com/angular/";
    var resObj = JSON.parse(this.responseText);
    for (var index = 0; index < 100; index++) {
        var repoElement = document.getElementById('repository' + index);
        var repoUrlElement = document.getElementById('repoUrl' + index);
        var repoName = resObj[index].name;
        repoElement.innerHTML = repoName;
        repoElement.setAttribute("name", repoName);
        repoUrlElement.setAttribute("href", githubUrl + repoName);

        var request = new XMLHttpRequest();
        request.open('get', 'https://api.github.com/repos/angular/' + repoName + '/contributors?per_page=10');
        request.send();
        request.response;
        request.onload = getContributorsAndContributions;
    }
}

function createUserDivs() {
    var str = "";
    for (var index = 0; index < 1000; index++) {
        str += "<div class=\"row contributors\" id=\"contributions" + index + "\" style=\"display: none\"> "
            + "<span id=\"reposNumber" + index + "\" class=\"col-md-4 col-xs-4 col-sm-4 col-lg-4 contributionsNumber\"></span>"
            + "<span id=\"user" + index + "\" class=\"col-md-3 col-xs-3 col-sm-3 col-lg-3 contributorsName\"></span>"
            + "<a id=\"url" + index + "\" target=\"_blank\" class=\"col-md-3 col-xs-3 col-sm-3 col-lg-3 \"><button class=\"btn btn-primary smallButton\">View profile</button></a><br />";
    }
    document.getElementById('users').innerHTML = str;
}

function getContributorsAndContributions() {
    var login = "";
    var contributionsNr = "";
    var githubUrl = "https://github.com/";
    var resObj = JSON.parse(this.responseText);
    for (var index = 0; index < resObj.length; index++) {
        login = resObj[index].login;
        contributionsNr = resObj[index].contributions;
        for (var id = 0; id < 1000; id++) {
            var userElement = document.getElementById('user' + id);
            var userRepoElement = document.getElementById('reposNumber' + id);
            var contributorSection = document.getElementById('contributions' + id);
            var urlElement = document.getElementById('url' + id);
            var newRepoNumber;
            if (login == userElement.innerHTML) {
                newRepoNumber = parseInt(userRepoElement.innerHTML) + parseInt(contributionsNr);
                userRepoElement.innerHTML = newRepoNumber;
                contributorSection.setAttribute("data-val", newRepoNumber);
                urlElement.setAttribute("href", githubUrl + login);
                contributorSection.style.display = 'inline';
                break;
            } else if (userElement.innerHTML == "") {
                userElement.innerHTML = login;
                userRepoElement.innerHTML = contributionsNr;
                contributorSection.setAttribute("data-val", contributionsNr);
                contributorSection.style.display = 'inline';
                break;
            }
            sortContributors();
        }
    }
}

function sortContributors() {
    var contributors = document.getElementsByClassName('contributors');
    var divs = [];
    for (var index = 0; index < contributors.length; ++index) {
        divs.push(contributors[index]);
    }
    divs.sort(function (a, b) {
        return (b.dataset.val) - (a.dataset.val);
    });

    var sorting = document.getElementById('users');
    divs.forEach(function (paramIn) {
        sorting.appendChild(paramIn);
    });
}

function filterContributors() {
    var minValue = document.getElementById('minValue').value;
    var maxValue = document.getElementById('maxValue').value;

    if (minValue == "") {
        minValue = parseInt("0");
    }
    if (maxValue == "") {
        maxValue = parseInt("99999");
    }

    var contributors = document.getElementsByClassName('contributors');
    var divs = [];
    for (var index = 0; index < contributors.length; index++) {
        divs.push(contributors[index]);
    }

    if (parseInt(minValue) == parseInt(maxValue)) {
        for (var index = 0; index < divs.length; index++) {
            var contributorEl = divs[index];
            var contributionsNumber = parseInt(contributorEl.dataset.val);
            if (contributionsNumber == minValue) {
                contributorEl.style.display = 'inline';
            } else {
                contributorEl.style.display = 'none';
            }
        }
    } else {
        for (var index = 0; index < divs.length; index++) {
            var contributorEl = divs[index];
            var contributionsNumber = parseInt(contributorEl.dataset.val);
            if (contributionsNumber < parseInt(minValue)) {
                contributorEl.style.display = 'none';
            } else {
                contributorEl.style.display = 'inline';
            }
            if (contributionsNumber > parseInt(maxValue)) {
                contributorEl.style.display = 'none';
            }
        }
    }
}

function unfilter() {
    var contributors = document.getElementsByClassName('contributors');
    var divs = [];
    for (var index = 0; index < contributors.length; index++) {
        divs.push(contributors[index]);
    }
    for (var index = 0; index < divs.length; index++) {
        var contributorEl = divs[index];
        if (!contributorEl.dataset.val == "") {
            contributorEl.style.display = 'inline';
        }
    }
}