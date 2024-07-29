let searchInput = document.querySelector(".field input"),
    searchButton = document.querySelector(".field span"),
    contentHolder = document.querySelector(".content");

searchInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") fetchData();
});
fetchData();
searchButton.onclick = fetchData;

function fetchData() {
    fetch(`https://api.github.com/rate_limit`)
        .then((res) => res.json())
        .then((rateLimit) => {
            if (rateLimit.rate.remaining === 0) {
                contentHolder.innerHTML =
                    "<span>Api Rate limit exceeded. Please try again later.</span>";
            } else {
                if (searchInput.value.trim() === "") {
                    contentHolder.innerHTML =
                        "<span>Please enter a name</span>";
                } else {
                    fetch(
                        `https://api.github.com/users/${searchInput.value}/repos`
                    )
                        .then((res) => {
                            if (!res.ok) {
                                throw new Error(
                                    "Network response was not ok " +
                                        res.statusText
                                );
                            }
                            return res.json();
                        })
                        .then((repos) => {
                            if (repos.length > 0) {
                                contentHolder.innerHTML = `<h2>Repositories: (${repos.length})</h2>`;

                                let profile = document.createElement("div");
                                profile.className = "profile";

                                let img = document.createElement("img");
                                img.src = repos[0].owner.avatar_url;
                                img.alt = "Profile";
                                profile.appendChild(img);

                                let details = document.createElement("div");
                                let name = document.createElement("span");
                                name.appendChild(
                                    document.createTextNode(
                                        repos[0].owner.login
                                    )
                                );
                                details.appendChild(name);

                                let profUrl = document.createElement("a");
                                profUrl.setAttribute("target", "_blank");
                                profUrl.href = repos[0].owner.html_url;
                                profUrl.appendChild(
                                    document.createTextNode("Visit")
                                );
                                details.appendChild(profUrl);

                                profile.appendChild(details);

                                contentHolder.prepend(profile);
                                repos.forEach((repo) => {
                                    let div = document.createElement("div");
                                    div.className = "repo";
                                    div.appendChild(
                                        document.createTextNode(repo.name)
                                    );

                                    let divButtonsHolder =
                                        document.createElement("div");
                                    divButtonsHolder.className = "info";

                                    let viewLink = document.createElement("a");
                                    viewLink.href = repo.html_url;
                                    viewLink.setAttribute("target", "_blank");
                                    viewLink.appendChild(
                                        document.createTextNode("View")
                                    );
                                    divButtonsHolder.appendChild(viewLink);

                                    let starsCount =
                                        document.createElement("span");
                                    starsCount.appendChild(
                                        document.createTextNode(
                                            "Stars: " + repo.stargazers_count
                                        )
                                    );
                                    divButtonsHolder.appendChild(starsCount);

                                    if (repo.language != null) {
                                        let langSpan =
                                            document.createElement("span");
                                        langSpan.className = "lang";
                                        langSpan.setAttribute(
                                            "title",
                                            "Most Used Language"
                                        );
                                        langSpan.appendChild(
                                            document.createTextNode(
                                                repo.language
                                            )
                                        );
                                        divButtonsHolder.appendChild(langSpan);
                                    }

                                    div.appendChild(divButtonsHolder);
                                    contentHolder.appendChild(div);
                                });
                            } else {
                                contentHolder.innerHTML =
                                    "<span>No Repository Found From This User</span>";
                            }
                        })
                        .catch((error) => {
                            contentHolder.innerHTML = `<span>Error: ${error.message}</span>`;
                        });
                }
            }
        })
        .catch((error) => {
            contentHolder.innerHTML = `<span>Error: ${error.message}</span>`;
        });
}
