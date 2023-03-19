export default function debugPrint(obj) {
  console.log("DEBUG " + obj.constructor.name + ": " + JSON.stringify(obj));
}

const varToString = (varObj) => Object.keys(varObj)[0];
