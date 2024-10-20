import { ethers } from "./ethers.js";
import { contractAddress, abi } from "./constant.js";

var nameField = document.getElementById("nameField");
var timeField = document.getElementById("timeField");
var totalKg = document.getElementById("totalKg");
var titleField = document.getElementById("titleField");
var locationFieldValue = document.getElementById("locationField").value;
var priceField = document.getElementById("priceField");

var fundButton = document.getElementById("fundButton");
fundButton.onclick = storeFunc;

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

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const contract = new ethers.Contract(contractAddress, abi, signer);
let cropContractAddress = await contract.viewContractAddresses();
console.log(cropContractAddress);
// console.log(contract);
// let cropContractAddress = await contract.viewContractAddresses();
// console.log(cropContractAddress);
// for (var i = 0; i < cropContractAddress.length; i++) {
//   // let cropContract = new ethers.Contract(cropContractAddress[i],cropApi ,provider)
//   console.log(cropContractAddress[i]);
// }

async function storeFunc() {
  const contract = new ethers.Contract(contractAddress, abi, signer);

  const contractValue = await contract.createCropContract(
    titleField.value,
    priceField.value,
    signer.getAddress(),
    nameField.value,
    locationFieldValue,
    Date(Date.now()),
    totalKg.value
  );
  await listenTransaction(contractValue, provider);
  console.log(await contract.cropAddress);
  console.log(contractValue);
}

function listenTransaction(contractValue, provider) {
  return new Promise((resolve, reject) => {
    provider.once(contractValue.hash, (reciept) => {
      console.log(reciept);
      resolve();
    });
  });
}

// function listenfortransactionresponse(transactionresponse, provider) {
//   return new Promise((resolve, reject) => {
//     provider.once(transactionresponse.hash, (transactionreceipt) => {
//       console.log(
//         `completed with ${transactionreceipt.confirmations} confirmation`
//       );
//       resolve();
//     });
//   });
// }
