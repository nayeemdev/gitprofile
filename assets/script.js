$(document).ready(function(){
    if(document.location.search.length < 11){
        window.location.replace("index.html");
    }

    function getUserName()
    {
        var username = window.location.href.slice(window.location.href.indexOf('=') + 1);
        return username;
    }
    $.ajax({
        url: "https://api.github.com/users/"+getUserName(),
        method: 'GET',
        contentType: 'application/json; charset=utf-8',

        success: function(data) {
            var allInfo = 
            `<div class="row">
                <div class="col-md-6 offset-md-3">
                    <div class="user_info">
                        <div class="avatar">
                            <img src="${data.avatar_url}" alt="avatar">
                        </div>
                        <h1 class="name">${data.name}</h1>
                        <h2 class="username"><a href="https://github.com/${data.login}" target="_blank" rel="noopener noreferrer">@${data.login}</a></h2>
                        <div class="info">
                            <span class="info__item">
                                <i class="fa fa-building icon"> </i> 
                                ${data.company}
                            </span>
                            <span class="info__item">
                                <i class="fa fa-map icon"> </i> 
                                ${data.location}
                            </span>
                            <span class="info__item">
                                <i class="fa fa-calendar icon"> </i> 
                                Joined ${data.created_at}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row count_wrapper">
                <div class="col-md-8 offset-md-2">
                    <div class="row">
                        <div class="col-md-3">
                            <div class="repo_info py-4">
                                <span class="num">${data.public_repos}</span>
                                <span class="num-label">Repositories</span>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="repo_info py-4">
                                <span class="num">${data.followers}</span>
                                <span class="num-label">Followers</span>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="repo_info py-4">
                                <span class="num">${data.following}</span>
                                <span class="num-label">Following</span>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="repo_info py-4">
                                <span class="num totalrepoStar"></span>
                                <span class="num-label">All Repo Star</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;

            $('.userInfoAjax').html(allInfo);
            
            $.get(data.repos_url, function(repoData) {
                repoData = eval( repoData );
                var repos = '', desc = '', totalStar = 0;
                Object.keys( repoData ).sort(function( b,a ) {
                    return repoData[a].stargazers_count.toString().localeCompare( repoData[b].stargazers_count.toString() );
                }).forEach(function( key ) {
                    totalStar += repoData[key].stargazers_count;
                    desc = (repoData[key].description != null) ? ((repoData[key].description.length > 100) ? (repoData[key].description.substring(0,100) + '...'): repoData[key].description) : '...';
                    repos += `
                    <div class="col-md-4">
                        <div class="card mb-3">
                            <div class="card-header">
                                <i class="fa fa-book icon"> </i> 
                                <a href="${repoData[key].html_url}">${repoData[key].name}</a>
                            </div>
                            <div class="card-body">
                                <p>
                                    ${desc}
                                </p>
                            </div>
                            <div class="card-footer">
                                <span>
                                    <i class="fa fa-language icon"> </i> 
                                    ${repoData[key].language}
                                </span>
                                <span>
                                    <i class="fa fa-star icon"> </i> 
                                    ${repoData[key].stargazers_count}
                                </span>
                                <span>
                                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="code-branch" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" class="svgSmall"><path fill="currentColor" d="M384 144c0-44.2-35.8-80-80-80s-80 35.8-80 80c0 36.4 24.3 67.1 57.5 76.8-.6 16.1-4.2 28.5-11 36.9-15.4 19.2-49.3 22.4-85.2 25.7-28.2 2.6-57.4 5.4-81.3 16.9v-144c32.5-10.2 56-40.5 56-76.3 0-44.2-35.8-80-80-80S0 35.8 0 80c0 35.8 23.5 66.1 56 76.3v199.3C23.5 365.9 0 396.2 0 432c0 44.2 35.8 80 80 80s80-35.8 80-80c0-34-21.2-63.1-51.2-74.6 3.1-5.2 7.8-9.8 14.9-13.4 16.2-8.2 40.4-10.4 66.1-12.8 42.2-3.9 90-8.4 118.2-43.4 14-17.4 21.1-39.8 21.6-67.9 31.6-10.8 54.4-40.7 54.4-75.9zM80 64c8.8 0 16 7.2 16 16s-7.2 16-16 16-16-7.2-16-16 7.2-16 16-16zm0 384c-8.8 0-16-7.2-16-16s7.2-16 16-16 16 7.2 16 16-7.2 16-16 16zm224-320c8.8 0 16 7.2 16 16s-7.2 16-16 16-16-7.2-16-16 7.2-16 16-16z" class=""></path></svg>
                                    ${repoData[key].forks}
                                </span>
                                <span>
                                    <i class="fa fa-folder icon"> </i> 
                                    ${repoData[key].size} KB
                                </span>
                            </div>
                        </div>
                    </div>
                    `;
                });
                $('.repoAjax').html(repos);
                $('.totalrepoStar').html(totalStar);
            });
        },
        complete: function(xhr){
            if(xhr.status == 404){
                window.location.replace("notfound.html");
            }
            $('.preloader').fadeOut('slow');
        }
    });
});