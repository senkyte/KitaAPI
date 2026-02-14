let kitaImage = document.getElementById("kitaImage");
let url = "https://danbooru.donmai.us/posts.json?tags=kita_ikuyo+rating:safe&limit=1&random=true";
let kitaSource = document.getElementById("kitaSource");
function changeKitaImage(){
    fetch(url)
    .then(response => response.json())
    .then(data => {
        let variants = data[0].media_asset.variants;
        let artist = data[0].tag_string_artist;
        let newurl = variants[1].url;
        let source = data[0].source;
        kitaImage.src = newurl;
        kitaSource.href = source;
        kitaSource.innerText = `Artist: ${artist}`;
    });
}

changeKitaImage();
window.addEventListener('message', event => {
    const data = event.data;
    if(data.lines % 10 === 0){
        changeKitaImage();
    }
});