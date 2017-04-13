// Require the BasicCard constructor function exported from basicCard.js.
var BasicCards = require('./basic_cards.js');


// Create a ClozeCard constructor that accepts text and cloze arguments.
function ClozeCard(fullText, cloze) {
  this.fullText = fullText;
  this.cloze = cloze;
};


// Create a ClozeCard method that returns only the full text.
ClozeCard.prototype.getFullText = function(fullText) {
  return this.fullText;
}


// Create a ClozeCard method that returns only the partial text.
// The this.partial method matches this.cloze within this.text and replaces it with "..."
ClozeCard.prototype.getPartialText = function(fullText, cloze) {
    return this.fullText.replace(this.cloze, '...');
}



// Should throw or log an error because "oops" doesn't appear in "This doesn't work"
//var brokenCloze("This doesn't work", "oops");
// Create a ClozeCard method that throws an error when the getPartialText() method does not include '...'
ClozeCard.prototype.brokenCloze = function(fullText, cloze) {
    throw new Error('The cloze deletion did not appear.');
}


  
// Export the ClozeCard constructor function to be required in flashCard.js
module.exports = ClozeCard;