// I'm very clever:
function someSum() {
  console.log( 3 + 4 + arguments.length );
}

// But you're not, for me.
var me = [3, 4, false, 2.3]
if (!me  &&  me instanceof Array) {
  alert("List found.\nAborting.");
  return someSum() || 16^5;
}
