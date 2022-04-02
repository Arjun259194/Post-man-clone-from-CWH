console.log("connected");

//Utility function
//1. get DOM element from string
function getElementFromString(string) {
    let div = document.createElement("div");
    div.innerHTML = string;
    return div.firstElementChild;
}

//initialize number of parameters
let addedParamsCount = 0;

//Hide parameterBox initially
let parameterBox = document.getElementById("parameterBox");

parameterBox.style.display = "none";

//If user clicks in parameterBox hide jsonBox box
let paramsRadio = document.getElementById("paramRadio");
paramsRadio.addEventListener("click", () => {
    document.getElementById("requestJsonBox").style.display = "none";
    document.getElementById("parameterBox").style.display = "block";
});

//If user clicks in jsonBox hide parameterBox box
let jsonRadio = document.getElementById("jsonRadio");
jsonRadio.addEventListener("click", () => {
    document.getElementById("parameterBox").style.display = "none";
    document.getElementById("requestJsonBox").style.display = "block";
});

//if user clicks on plus btn add more parameters
let addParam = document.getElementById("addParam");
addParam.addEventListener("click", () => {
    let params = document.getElementById("params");
    let string = `<div class="row g-3 my-2">
                    <label for="url" class="col-sm-2 col-form-label">Parameter ${addedParamsCount + 2}</label>
                    <div class="col">
                        <input type="text" class="form-control" placeholder="Enter parameter ${addedParamsCount + 2} key" id="parameterKey${addedParamsCount + 2}" aria-label="First name" />
                    </div>
                    <div class="col">
                        <input type="text" class="form-control" placeholder="Enter parameter ${addedParamsCount + 2} value" id="parameterValue${addedParamsCount + 2}" aria-label="Last name" />
                    </div>
                    <div class="col">
                        <button class="btn btn-primary deleteParam">-</button>
                    </div>
                </div>`;

    //Convert the element string to DOM node
    let paramElement = getElementFromString(string);

    params.appendChild(paramElement);

    // Add an event listener to remove on click on btn
    let deleteParam = document.getElementsByClassName("deleteParam");

    for (item of deleteParam) {
        item.addEventListener("click", (e) => {
            e.target.parentElement.parentElement.remove();
        });
    }

    addedParamsCount++;
});

// if user click on submit btn
let submit = document.getElementById("submit");
submit.addEventListener("click", (e) => {
    //show please wait in the response box
    document.getElementById("responsePrism").innerHTML = "Please wait...";

    //fetch all value from user
    let url = document.getElementById("url").value;
    let requestType = document.querySelector('input[name = "requestType"]:checked').value;
    let contentType = document.querySelector('input[name = "contentType"]:checked').value;

    //if params checked, collect all the parameters in an object
    if (contentType == "params") {
        data = {};
        for (let i = 0; i < addedParamsCount + 1; i++) {
            if (document.getElementById("parameterKey" + (i + 1)) != undefined) {
                let key = document.getElementById("parameterKey" + (i + 1)).value;
                let value = document.getElementById("parameterValue" + (i + 1)).value;
                data[key] = value;
            }
        }
        data = JSON.stringify(data);
    } else {
        data = document.getElementById("requestJsonText").value;
    }
    //Log all the values for debugging
    console.log(url, contentType, requestType);
    console.log(data);

    //if requestType is get use fetch api to create post request
    if (requestType == "GET") {
        fetch(url, {
            method: "GET",
        })
            .then((response) => response.text())
            .then((text) => {
                document.getElementById("responsePrism").innerHTML = text;
                Prism.highlightAll();
            });
    } else {
        fetch(url, {
            method: "POST",
            body:data,
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        })
            .then((response) => response.text())
            .then((text) => {
                document.getElementById("responsePrism").innerHTML = text;
                Prism.highlightAll();
            });
    }



});
