let text= document.getElementsByClassName("text")
const library= Document.getElementById("Library")
function Book (bookName,Author,ProductionDate,Description) {
    this.bookName=bookName;
    this.Author= Author;
    this.ProductionDate= ProductionDate;
}
const Book= new BOOK ("Harry potter","J.K Rowlings","6th march 2005")
function GetBookInfo(BOOK){
    if(text) {text.textContent=Book}
addEventListener('onclick', ()=>GetBookInfo(Book));
Book.appendChild(text)
}