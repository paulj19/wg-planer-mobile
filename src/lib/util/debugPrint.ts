export function debugPrint(obj) {
  console.log("DEBUG " + varToString(obj) + ": " + JSON.stringify(obj));
}

const varToString = (varObj) => Object.keys(varObj)[0];
