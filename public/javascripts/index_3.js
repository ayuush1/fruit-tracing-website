import { ethers } from "./ethers.js";
import { contractAddress, abi, walletAddress, cropApi } from "./constant.js";
var locationFeature = document.getElementById("locationFeature");

var url = window.location.href;
const id = url.split("/").pop();
console.log(id);
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const contract = new ethers.Contract(id, cropApi, signer);
let cropContractAddress = await contract.getAllOwners();

for (var i = 0; i < cropContractAddress.length; i++) {
  var tr = document.createElement("tr");
  var td = document.createElement("td");
  td.append(await cropContractAddress[i]);
  var td2 = document.createElement("td");
  td2.append(await contract.ownerToLocation(cropContractAddress[i]));
  tr.append(td);
  tr.append(td2);
  locationFeature.append(tr);
}

console.log(cropContractAddress);
