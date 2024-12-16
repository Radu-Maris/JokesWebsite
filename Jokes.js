var load_flag = 0;
let reportedElement = null;

function preLoaderHandler(){
    
    if(load_flag === 1){
        showSite();
    }
    else{
        setTimeout(function(){
            load_flag = 1;
            preLoaderHandler();
            }, 2001
        );
    }
}

function showSite(){
    var loader = document.getElementById('loader');
    var content = document.getElementById('content');
    
    loader.style.display = 'none';
    content.style.display = 'block';
}

function getJokes(category = "Any") {
    load_flag=0;
    preLoaderHandler();
    
    fetch(`https://sv443.net/jokeapi/v2/joke/${category}?amount=10`)
        .then(response => response.json())
        .then(data => {
            const jokesContainer = document.getElementById("jokes");
            jokesContainer.innerHTML = "";
            console.log(category);
            data.jokes.forEach(joke => {
                const jokeElement = document.createElement("div");
                jokeElement.classList.add("joke");

                if (joke.type === "single") {
                    jokeElement.innerText = joke.joke;
                } else if (joke.type === "twopart") {
                    jokeElement.innerText = joke.setup;

                    const deliveryElement = document.createElement("div");
                    deliveryElement.classList.add("delivery");
                    deliveryElement.innerText = joke.delivery;

                    deliveryElement.style.display = "none";

                    jokeElement.appendChild(deliveryElement);

                    jokeElement.addEventListener("mouseenter", () => {
                        deliveryElement.style.display = "block";
                    });

                    jokeElement.addEventListener("mouseleave", () => {
                        deliveryElement.style.display = "none";
                    });
                }
                
                const reportButton = document.createElement("button");
                reportButton.innerText = "Report";
                reportButton.classList.add("reportButton");

                
                reportButton.addEventListener("click", () =>{
                    showConfirmationDialog(jokeElement);
                });

                jokeElement.appendChild(reportButton);
                jokesContainer.appendChild(jokeElement);
            });
        })
        .catch(error => {
            console.error("Error when getting jokes:", error);
        });
}

function categorySelection() {
    const categoryButtons = document.querySelectorAll(".navigation_button");
    let category = null;
    categoryButtons.forEach(button => {
        button.addEventListener("click", () => {
            if(button.innerText === "All"){
                category = "Any";
            }
            else{
                category = button.innerText;
            }
            console.log(category);
            localStorage.setItem("selectedCategory", category);
            location.reload();
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const savedCategory = localStorage.getItem("selectedCategory") || "Any";
    getJokes(savedCategory);
    categorySelection();

    const activeButton = [...document.querySelectorAll(".navigation_button")]
        .find(button => button.innerText === savedCategory || (savedCategory === "Any" && button.innerText === "All"));
    
    if (activeButton) {
        activeButton.classList.add("active");
    }
    document.getElementById("confirmReport").addEventListener("click", confirmReport);
    document.getElementById("cancelReport").addEventListener("click", hideConfirmationDialog);
});

function showConfirmationDialog(element) {
    reportedElement = element;
    document.getElementById("confirmationDialog").style.display = "flex";
}

function hideConfirmationDialog() {
    document.getElementById("confirmationDialog").style.display = "none";
}

function confirmReport() {
    if (reportedElement) {
        reportedElement.style.backgroundColor = "#534242";
        reportedElement = null;
    }
    hideConfirmationDialog();
}

categorySelection();