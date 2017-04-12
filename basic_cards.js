// Basic flashcards have a front ("Who was the first president of the United States?") and a back ("George Washington").

// Create a BasicCard constructor that accepts front and back arguments.
function BasicCard(front, back) {
  this.front = front;
  this.back = back;
};

// Export the BasicCard constructor function to be required in clozeCard.js
module.exports = BasicCard;