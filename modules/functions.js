// function not functions but here it is
// Sorting pills by Y
function sortByY(a, b) {
    return b.pieces[0].y - a.pieces[0].y;
}
function displayInfo() {
    alert(
        "ABY PRZEJŚĆ DO NASTĘPNEGO POZIOMU LUB PO GAME OVER KLIKNIJ ENTER, ABY WYŁĄCZYĆ TO POWIADOMIENIE ZMIEŃ W PLIKU main.js  info NA FALSE, dziękuję"
    );
}
export { sortByY, displayInfo };
export default sortByY;
