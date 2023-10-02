/*********************************************************************************
*  WEB422 – Assignment 2
*  I declare that this assignment is my own work in accordance with Seneca Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Nicole Barrero Student ID: 158270215 Date: 10/01/2023
*
********************************************************************************/ 

var page = 1; 
var perPage = 10; 

function loadCompanyData(tag=null) {

    let apiUrl = `/api/companies?page=${page}&perPage=${perPage}`;
    if (tag !== null) {
        apiUrl += `&tag=${tag}`; //?
        page = 1;
        const paginationElement = document.querySelector(".pagination");
        paginationElement.classList.add("d-none");
    } else {
        const paginationElement = document.querySelector(".pagination");
        paginationElement.classList.remove("d-none");
    }

    fetch(apiUrl)
        .then((res) => res.json())
        .then((data) => {
          displayData(data);

            // updating
            const currentPageElement = document.querySelector("#current-page");
            currentPageElement.textContent = page; 
        })
        .catch((error) => {
            console.error(error);
        });
}

// table row from company data
const companyObjectToTableRowTemplate = (companyObj) => {
    return `
        <tr data-id="${companyObj.name}">
            <td>${companyObj.name || "--"}</td>
            <td>${companyObj.category_code || "--"}</td>
            <td>${companyObj.description || "--"}</td>
            <td>${companyObj.founded_month}/${companyObj.founded_day}/${companyObj.founded_year || "--"}</td>
            <td>${getFounderName(companyObj.relationships) || "--"}</td>
            <td>${getFirstOffice(companyObj.offices) || "--"}</td>
            <td>${companyObj.number_of_employees || "--"}</td>
            <td>${getFirstTwoTags(companyObj.tag_list) || "--"}</td>
            <td>${companyObj.homepage_url || "--"}</td>
        </tr>
    `;
};

function displayData(data) { 
    const tBody = document.querySelector("#companiesTable tbody");
    tBody.innerHTML = ""; //empty
    
    //update it to show your newly created <tr> elements.
    data.forEach((company) => {
        const row = document.createElement("tr");
        row.innerHTML = companyObjectToTableRowTemplate(company);

        row.addEventListener("click", () => {
            const companyId = row.getAttribute("data-id");

            // request for data
                fetch(`/api/companies/${companyId}`)
                .then((res) => res.json())
                .then((companyData) => {
                    // set
                    const modalTitle = document.querySelector(".modal-title");
                    modalTitle.textContent = companyData.name;

                    const modalBody = document.querySelector(".modal-body");
                    modalBody.innerHTML = `
                        <strong>Category:</strong> ${companyData.category_code || "--"}<br /><br />
                        <strong>Description:</strong> ${companyData.description || "--"}<br /><br />
                        <strong>Overview:</strong> ${companyData.overview || "--"}<br /><br />
                        <strong>Tag List:</strong> <ul> ${getFirstTwoTags(companyData.tag_list) || "--"}</ul><br /><br />
                        <strong>Founded:</strong> ${companyData.founded_month}/${companyData.founded_day}/${companyData.founded_year || "--"}<br /><br />
                        <strong>Key People:</strong> ${getFounderNames(companyData.relationships) || "--"}<br /><br />
                        <strong>Products:</strong> <ul>${companyData.products || "--"}</ul><br /><br />
                        <strong>Number of Employees:</strong> ${companyData.number_of_employees || "--"}<br /><br />
                        <strong>Website:</strong> <a href="${companyData.homepage_url || ""}" target="_blank">${companyData.homepage_url || "--"}</a><br /><br />
                    `;

                    // display!
                    const detailsModal = new bootstrap.Modal(document.getElementById("detailsModal"));
                    detailsModal.show();
                })
                .catch((error) => {
                    console.error(error);
                });
        });

        tableBody.appendChild(row);
    });
}
  

// get first two tags
function getFirstTwoTags(tagList) {
    if (tagList) {
        const tags = tagList.split(",");
        const firstTwoTags = tags
            .filter((tag, index) => index < 2) 
            .join(", ");
        return firstTwoTags || "";
    }
    return "";
}

// get the first founder's name
function getFounderName(relationships) {
    if (!relationships) return "";
        const founderRelation = relationships.find((relation) => relation.title && relation.title.includes("Founder"));
        if (founderRelation) {
            return `${founderRelation.first_name} ${founderRelation.last_name}`;
        }
        return "";
    }

    function getFounderName(relationships) {
        if (Array.isArray(relationships)) {
            const founderRelation = relationships.find((relation) => relation.title && relation.title.includes("Founder"));
            if (founderRelation) {
                return `${founderRelation.first_name} ${founderRelation.last_name}`;
            }
        }
        return "";
    }


document.addEventListener("DOMContentLoaded", () => {

    loadCompanyData(); 

    // "previous page" pagination button
    const previousPageButton = document.querySelector("#previous-page");
    previousPageButton.addEventListener("click", () => {
        if (page > 1) {
            page--;
            loadCompanyData();
        }
    });

    const nextPageButton = document.querySelector("#next-page");
    nextPageButton.addEventListener("click", () => {
        page++;
        loadCompanyData();
    });

    // Submit
    const searchForm = document.querySelector("#searchForm");
    searchForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const tagField = document.querySelector("#tag");
        const tagValue = tagField.value.trim();
        loadCompanyData(tagValue);
    });

    const clearFormButton = document.querySelector("#clearForm");
    clearFormButton.addEventListener("click", () => {
        const tagField = document.querySelector("#tag");
        tagField.value = "";
        loadCompanyData();
    });
});
