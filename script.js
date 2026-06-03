
const song = new Audio("asset/songs/1.mp3");
const song_name = document.querySelector(".song-info");
const playPausebtn = document.querySelector(".play-pause");
const playPauseIcon = document.querySelector(".play-pause img");
const progressbar = document.querySelector(".progress-bar");
const songtime = document.querySelector(".song-time");
let currentsong = 0;
const nextbtn = document.querySelector(".next-btn");
const prevbtn = document.querySelector(".prev-btn");
const currentSongLibrary = document.querySelector(".current-song");
const createPlaylistbtn = document.querySelector(".createplaylist");
const popup = document.querySelector(".popup-overlay");
const donebtn = document.querySelector(".done-btn");
const playlistInput = document.querySelector(".playlist-input");
const playlistList = document.querySelector(".playlist-list");
const hamburger = document.querySelector(".hamburger");
const sidebar = document.querySelector(".left"); 
const closeSidebar = document.querySelector(".close-sidebar");
const volumeSlider = document.querySelector(".volume-slider");
const playlistSections = document.querySelector(".playlist-sections");
let songs = [];
let currentSongs = [];


async function loadSongs(folder){

    const response =
    await fetch(
        `asset/songs/${folder}/info.json`
    );

    const songs =
    await response.json();

    if(songs.length === 0){
        return;
    }

    const section =
    document.createElement(
        "div"
    );

    section.classList.add(
        "playlist-section"
    );

    section.innerHTML =
    `
    <div class="heading">
        <h2>
            ${
                folder
                .replace("-", " ")
                .replace(
                    /\b\w/g,
                    c => c.toUpperCase()
                )
            }
        </h2>

        <span>
            show all
        </span>
    </div>

    <div class=
    "card-container">

    </div>
    `;

    if(folder === "trending-songs"){
        playlistSections
        .prepend(section);
    }

    else{
        playlistSections
        .appendChild(section);
    }

    const cardContainer =
    section.querySelector(
        ".card-container"
    );

    songs.forEach(
        (songData, index)=>{

        cardContainer.innerHTML +=
        `
        <div class="card"
        data-index="${index}">
            
            <div class="play-btn">
                <img
                src="asset/play.svg"
                alt="">
            </div>

            <img
            src="asset/${
                songData.cover ||
                "default-cover.png"
            }"
            alt="">

            <h4>
                ${songData.name}
            </h4>

            <p>
                ${
                    songData.artist ||
                    ""
                }
            </p>

        </div>
        `;

    });

    const cards =
    cardContainer
    .querySelectorAll(
        ".card"
    );

    cards.forEach(
        (card, index)=>{

        card.addEventListener(
            "click",
            ()=>{


                currentSongs = songs;

                currentsong = index;

                song.src = currentSongs[index].file;

                song.play();

                song_name.innerText =
                currentSongs[index].name;

                currentSongLibrary
                .innerText =
                currentSongs[index].name;

                playPauseIcon.src =
                "asset/pause.svg";

        });

    });

}



playPausebtn.addEventListener("click", ()=>{
    
    if(song.src === "") return;
    if(song.paused){
        song.play();
        playPauseIcon.src = "asset/pause.svg";
    }
    else{
        song.pause();
        playPauseIcon.src = "asset/play.svg";
    }

})

nextbtn.addEventListener(
    "click",
    ()=>{

    if(
        currentsong ===
        currentSongs.length - 1
    ){
        return;
    }

    currentsong++;

    song.src =
    currentSongs[currentsong].file;

    song.play();

    song_name.innerText =
    currentSongs[currentsong].name;

    currentSongLibrary.innerText =
    currentSongs[currentsong].name;

    playPauseIcon.src =
    "asset/pause.svg";

})

prevbtn.addEventListener(
    "click",
    ()=>{

    if(currentsong === 0){
        return;
    }

    currentsong--;

    song.src =
    currentSongs[currentsong].file;

    song.play();

    song_name.innerText =
    currentSongs[currentsong].name;

    currentSongLibrary.innerText =
    currentSongs[currentsong].name;

    playPauseIcon.src =
    "asset/pause.svg";

})


song.addEventListener("timeupdate",()=>{
    progressbar.value = (song.currentTime / song.duration)*100;
    
    let minutes = Math.floor(song.currentTime / 60);
    let seconds = Math.floor(song.currentTime%60);

    if(seconds < 10){

        seconds = "0" + seconds;
    }

    songtime.innerText = `${minutes}:${seconds}`;
})



progressbar.addEventListener("input",()=>{
    song.currentTime = (progressbar.value/100)*song.duration;
})


createPlaylistbtn.addEventListener("click", ()=>{
    popup.classList.remove("hidden")
})


function addPlaylist(name){

    const playlist =
    document.createElement("div");

    playlist.classList.add(
        "playlist-item"
    );

    playlist.innerHTML =
    `
    <span>${name}</span>
    <button class="delete-btn">
        ❌
    </button>
    `;

    const deleteBtn =
    playlist.querySelector(
        ".delete-btn"
    );

    deleteBtn.addEventListener(
        "click",
        ()=>{

            playlist.remove();

            let playlists =
            JSON.parse(
                localStorage.getItem(
                    "playlists"
                )
            ) || [];

            playlists =
            playlists.filter(
                (item)=> item !== name
            );

            localStorage.setItem(
                "playlists",
                JSON.stringify(
                    playlists
                )
            );

        }
    );

    playlistList.appendChild(
        playlist
    );

}


donebtn.addEventListener("click", ()=>{

    const playlistname = playlistInput.value.trim();

    if(playlistname === ""){
        return;
    }

    addPlaylist(playlistname);


    let playlists = JSON.parse(localStorage.getItem("playlists")) || [];
    playlists.push(playlistname);
    localStorage.setItem("playlists", JSON.stringify(playlists))

    playlistInput.value = "";

    popup.classList.add("hidden");

})


let savedPlaylists = JSON.parse(localStorage.getItem("playlists")) ||[];

savedPlaylists.forEach((playlist)=>{
    addPlaylist(playlist);
})


hamburger.addEventListener("click",()=>{
    sidebar.classList.toggle("active");
})

closeSidebar.addEventListener("click",()=>{
        sidebar.classList.remove("active");
})

volumeSlider.addEventListener("input",()=>{
        song.volume =
        volumeSlider.value;
})

loadSongs("trending-songs");
loadSongs("haryanvi");
loadSongs("hindi");
loadSongs("english");
loadSongs("punjabi");