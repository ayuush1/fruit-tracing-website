import { ethers } from "./ethers.js";
import { contractAddress, abi, walletAddress, cropApi } from "./constant.js";
var cropCard = document.getElementById("cropCard");
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner(walletAddress);
const contract = new ethers.Contract(contractAddress, abi, signer);
let cropContractAddress = await contract.viewContractAddresses();
var locationFieldValue = document.getElementById("location");
var cropValue;
var vendorData;
const autoCompleteSearch = async (lat, lon) => {
  const url = `https://us1.locationiq.com/v1/reverse?key=pk.3a5689b301932dd8706b8001d602fa92&lat=${lat}&lon=${lon}&format=json`;

  var fetchData = await fetch(url, {
    method: "get",
    headers: {},
  })
    .then((res) => res.json())
    .then((resJson) => {
      locationFieldValue = `${resJson.address.road},  ${resJson.address.city}`;
    })
    .catch((e) => {
      console.log("Error in getAddressFromCoordinates", e);
    });
};

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(async (position) => {
    await autoCompleteSearch(
      position.coords.latitude,
      position.coords.longitude
    );
  });
} else {
  x.innerHTML = "Geolocation is not supported by this browser.";
}

for (var i = 0; i < cropContractAddress.length; i++) {
  let cropContract = new ethers.Contract(
    cropContractAddress[i],
    cropApi,
    signer
  );
  // create a div with class "col-sm-3"
  const colDiv = document.createElement("div");
  colDiv.classList.add("col-sm-4");
  colDiv.classList.add("mt-4");

  // create a div with class "card" and style "width: 18rem;"
  const cardDiv = document.createElement("div");
  cardDiv.classList.add("card");
  cardDiv.style.width = "18rem";

  // create a div with class "card-body"
  const cardBodyDiv = document.createElement("div");
  cardBodyDiv.classList.add("card-body");

  // create a h5 tag with class "card-title" and text "Apple"
  const title = document.createElement("h5");
  title.classList.add("card-title");
  title.innerText = `${await cropContract.getTitle()}`;

  // create p tags with class "card-text" and add necessary text
  const vendor = document.createElement("p");
  vendor.classList.add("card-text");
  vendor.innerText = `Vendor Name:${await cropContract.getName()}`;

  const kg = document.createElement("p");
  kg.classList.add("card-text");
  kg.innerText = `Total Kg:${await cropContract.getTotalkg()}`;

  const time = document.createElement("p");
  time.classList.add("card-text");
  time.innerText = ` time:${await cropContract.getTimestamp()}`;

  const location = document.createElement("p");
  location.classList.add("card-text");
  location.innerText = `Location: ${await cropContract.getLocation()}`;

  const price = document.createElement("p");
  price.classList.add("card-text");
  price.innerText = `Price:${await cropContract.getPrice()}`;

  const buyButton = document.createElement("button");
  buyButton.setAttribute("id", cropContractAddress[i]);
  buyButton.setAttribute("class", "buyButton btn btn-primary");
  buyButton.setAttribute("data-toggle", "modal");
  buyButton.setAttribute("data-target", `#modal_${cropContractAddress[i]}`);
  buyButton.innerHTML = "Buy";

  const qr = document.createElement("div");
  price.setAttribute("id", `${cropContractAddress[i]}`);

  // let dataQR = {
  //   title: `${await cropContract.getTitle()}`,
  //   kg: `${await cropContract.getTotalkg()}`,
  //   timeStamp: `${await cropContract.getTimestamp()}`,
  //   location: `${await cropContract.getLocation()}`,
  //   price: `${await cropContract.getPrice()}`,
  //   where: `${await cropContract.ownerToLocation}`,
  // };

  var Qrmade = new QRCode(qr, {
    text: "http://localhost:3000/viewdetails/" + `${cropContractAddress[i]}`,
  });

  const button = document.createElement("button");
  button.type = "button";
  button.classList.add("btn", "btn-primary");
  button.setAttribute("data-toggle", "modal");
  button.setAttribute("data-target", `#modal_${cropContractAddress[i]}`);
  button.textContent = "Update";

  // append all the created elements
  cardBodyDiv.appendChild(qr);
  cardBodyDiv.appendChild(title);
  cardBodyDiv.appendChild(vendor);
  cardBodyDiv.appendChild(kg);
  cardBodyDiv.appendChild(time);
  cardBodyDiv.appendChild(location);
  cardBodyDiv.appendChild(price);
  if (
    (await cropContract.getOwner()) == (await provider.getSigner().getAddress())
  ) {
    cardBodyDiv.appendChild(button);
    console.log(`owner ......${await cropContract.getOwner()}`);
    console.log(`contract......${await provider.getSigner().getAddress()}`);
  } else {
    cardBodyDiv.appendChild(buyButton);
  }

  // cardBodyDiv.appendChild(viewBtn);
  // cardBodyDiv.appendChild(buyButton);

  cardDiv.appendChild(cardBodyDiv);

  colDiv.appendChild(cardDiv);
  cropCard.prepend(colDiv);

  //formInsideModal
  var formInside = document.createElement("div");
  formInside.setAttribute("class", "formInside");

  var nameModal = document.createElement("input");
  nameModal.setAttribute("id", `name_${cropContractAddress[i]}`);
  nameModal.setAttribute("type", "text");
  nameModal.setAttribute("placeholder", "Vendor Name");
  nameModal.setAttribute("class", "vendor");

  var inputTime = document.createElement("input");
  inputTime.setAttribute("id", `time_${cropContractAddress[i]}`);
  inputTime.setAttribute("type", "hidden");
  inputTime.setAttribute("class", "time");

  var locationModal = document.createElement("input");
  locationModal.setAttribute("id", `location_${cropContractAddress[i]}`);
  locationModal.setAttribute("type", "hidden");
  locationModal.setAttribute("class", "location");

  var fieldModal = document.createElement("input");
  fieldModal.setAttribute("id", `price_${cropContractAddress[i]}`);
  fieldModal.setAttribute("type", "number");
  fieldModal.setAttribute("placeholder", "price");
  fieldModal.setAttribute("class", "crop_price");

  if (
    (await cropContract.getOwner()) !==
    (await provider.getSigner().getAddress())
  ) {
    formInside.append(nameModal);
    formInside.append(inputTime);
    formInside.append(locationModal);
  } else {
    formInside.append(fieldModal);
  }

  //end form Inside modal

  // Create the modal container element
  const modal = document.createElement("div");
  modal.id = `modal_${cropContractAddress[i]}`;
  modal.classList.add("modal", "fade");
  modal.tabIndex = "-1";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-labelledby", "exampleModalLiveLabel");

  // Create the modal dialog element
  const modalDialog = document.createElement("div");
  modalDialog.classList.add("modal-dialog");
  modalDialog.setAttribute("role", "document");

  // Create the modal content element
  const modalContent = document.createElement("div");
  modalContent.classList.add("modal-content");

  // Create the modal header element
  const modalHeader = document.createElement("div");
  modalHeader.classList.add("modal-header");

  // Create the modal title element
  const modalTitle = document.createElement("h5");
  modalTitle.classList.add("modal-title");
  modalTitle.id = "exampleModalLiveLabel";
  modalTitle.textContent = "";

  // Create the modal close button
  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.classList.add("close");
  closeButton.setAttribute("data-dismiss", "modal");
  closeButton.setAttribute("aria-label", "Close");

  // Create the close button icon
  const closeIcon = document.createElement("span");
  closeIcon.setAttribute("aria-hidden", "true");
  closeIcon.textContent = "×";

  // Append the close button icon to the close button
  closeButton.appendChild(closeIcon);

  // Append the modal title and close button to the modal header
  modalHeader.appendChild(modalTitle);
  modalHeader.appendChild(closeButton);

  // Create the modal body element
  const modalBody = document.createElement("div");
  modalBody.classList.add("modal-body");
  modalBody.append(formInside);

  // Create the modal footer element
  const modalFooter = document.createElement("div");
  modalFooter.classList.add("modal-footer");

  // Create the close button element
  const closeButtonFooter = document.createElement("button");
  closeButtonFooter.type = "button";
  closeButtonFooter.classList.add("btn", "btn-secondary");
  closeButtonFooter.setAttribute("data-dismiss", "modal");
  closeButtonFooter.textContent = "Close";

  // Create the save button element
  const saveButton = document.createElement("button");
  saveButton.type = "button";
  saveButton.classList.add("btn", "btn-primary", "save");
  saveButton.textContent = "Save changes";
  saveButton.id = `save_${cropContractAddress[i]}`;

  const buy = document.createElement("button");
  buy.type = "button";
  buy.classList.add("btn", "btn-primary", "save");
  buy.textContent = "buy ";
  buy.id = `save_${cropContractAddress[i]}`;

  // Append the close and save buttons to the modal footer
  modalFooter.appendChild(closeButtonFooter);
  if (
    (await cropContract.getOwner()) == (await provider.getSigner().getAddress())
  ) {
    modalFooter.appendChild(saveButton);
  } else {
    modalFooter.appendChild(buy);
  }

  // Append the header, body, and footer to the modal content
  modalContent.appendChild(modalHeader);
  modalContent.appendChild(modalBody);
  modalContent.appendChild(modalFooter);

  // Append the modal content to the modal dialog
  modalDialog.appendChild(modalContent);

  // Append the modal dialog to the modal container
  modal.appendChild(modalDialog);

  // Add the modal container to the page
  cropCard.append(modal);
}

// let buyButton = document.querySelectorAll(".buyButton");
// for (var i = 0; i < buyButton.length; i++) {
//   buyButton[i].addEventListener("click", (e) => {
//     console.log(e.target.id);
//     buyCrop(e.target.id);
//   });
// }
let vendor = document.querySelectorAll(".vendor");
for (var i = 0; i < vendor.length; i++) {
  vendor[i].addEventListener("change", (e) => {
    vendorData = e.target.value;
    console.log(vendorData);
  });
}
let cropPrice = document.querySelectorAll(".crop_price");
for (var i = 0; i < cropPrice.length; i++) {
  cropPrice[i].addEventListener("change", (e) => {
    cropValue = e.target.value;
    console.log(cropValue);
  });
}

var saveButton = document.querySelectorAll(".save");
for (var i = 0; i < saveButton.length; i++) {
  saveButton[i].addEventListener("click", (e) => {
    saveCrop(e.target.id);
  });
}

var buy = document.querySelectorAll(".save");
for (var i = 0; i < buy.length; i++) {
  buy[i].addEventListener("click", (e) => {
    buyCrop(e.target.id);
  });
}

async function buyCrop(contractAddress) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  var address = contractAddress.slice(5);
  var time = document.getElementById(`time_${address}`);
  time.value = Date(Date.now());
  let contract = new ethers.Contract(address, cropApi, signer);
  console.log(await contract.getOwner());
  let sellingPrice = await contract.getPrice();
  let transaction = await contract.buyCrop(
    locationFieldValue,
    time.value,
    vendorData,
    {
      value: ethers.utils.parseEther(sellingPrice.toString()),
    }
  );
  await listenTransaction(transaction, provider);
  console.log(locationFieldValue);
  console.log(await contract.ownerToLocation);
}
async function saveCrop(contractAddress) {
  var address = contractAddress.slice(5);
  console.log(address);
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  console.log(await signer.getAddress());
  let contract = new ethers.Contract(address, cropApi, signer);
  console.log(await contract.getOwner());
  var transaction = await contract.setprice(cropValue);
  await listenTransaction(transaction, provider);
}
function listenTransaction(contractValue, provider) {
  return new Promise((resolve, reject) => {
    provider.once(contractValue.hash, (reciept) => {
      console.log(reciept);
      resolve();
    });
  });
}
