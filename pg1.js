document.querySelector('.popup-btn').addEventListener('click', function() {
    document.getElementById('popup').classList.remove('hidden');
});

function closePopup() {
    document.getElementById('popup').classList.add('hidden');
}
